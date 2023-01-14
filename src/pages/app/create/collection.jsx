import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PocketBase from 'pocketbase';
import { List, arrayMove, arrayRemove } from 'react-movable';
import noImage from '../../../images/noImage.jpeg';
import global, { getImageUrl } from '../../../globalVars';

const RemovableIcon = () => (
  <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="CurrentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className="feather feather-x-circle"
  >
    <title>Remove</title>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);
const buttonStyles = {
  border: 'none',
  margin: 0,
  padding: 0,
  width: 'auto',
  overflow: 'visible',
  cursor: 'pointer',
  background: 'transparent'
};
const HamburgerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
  </svg>
)


export default function CreateCollection() {
  const navigate = new useNavigate();
  const client = new PocketBase(global.pocketbaseUrl);
    
  const [search, setSearch] = useState('');
  
  const [collectionName, setCollectionName] = useState('');
  const [description, setDescription] = useState('');
  
  const [books, setBooks] = React.useState([]);
  const [items, setItems] = React.useState([]);


  const getBooks = async (searchRequest) => {
    try {
      const response = await client.collection('book').getList(1, 4, {
        filter: `name ~ "${searchRequest}"`
      });
      //reset page on search
      setBooks(response.items);
    } catch(err){}
  }

  function handleChange(event) {
    setSearch(event.target.value);
    getBooks(event.target.value);
  }

  function appendBook(name, id) {
    setItems((e) => [...e, {name: `${name}`, id: `${id}`}])
  }

  const submit = async () => {
    const data = {
      "user": client.authStore.model.id,
      "books": items.map(({id}) => (id)),
      "name": collectionName,
      "description": description
    };

    try {
      const record = await client.collection('collection').create(data);
      navigate('/')
    } catch(err) {
      console.log(err);
    }
  }

  return(
    <>
    <div className="px-4 text-white">
      
      <h2 className="py-2 pr-4 text-lg font-light text-white ">Collection Name</h2>
      <input maxLength={100} type="text" className="w-full px-4 py-2 text-white input-text" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} />
      <h2 className="py-2 pr-4 text-lg font-light text-white">Description <span className="italic text-gray-300">(optional)</span></h2>
      <textarea maxLength={5000} rows="18" type="text" className="w-full px-4 py-2 text-white input-text" placeholder="" value={description} onChange={(e) => setDescription(e.target.value)} />
      
      <h2 className="py-2 pr-4 text-lg font-light text-white">Add Books <span className="italic text-gray-300">(optional)</span></h2>
      <input type="text" value={search} onChange={handleChange} className="w-full px-4 py-2 text-white input-text" placeholder='Search' />
      {books.map((book, idx) => (
        <div className="flex gap-1 px-2 py-2 my-2 input-text" key={idx.toString()} id={idx.toString()}>
          <div className="w-1/3" style={{
            minHeight: "4rem"}}>
              {book.coverImage ? 
              <img className="rounded-md max-h-32" src={getImageUrl(book.id, book.coverImage)} />
              :
              <img className="rounded-md max-h-32" src={noImage} />
            }
          </div>
          <div className="flex flex-col w-full">
            <p className="text-xl text-white ">{book.name ? 
            <>{book.name.substring(0, 18)}<span className="text-transparent bg-gradient-to-r from-white to-white/0 bg-clip-text">{book.name.substring(18, 24)}</span></>
            : "Untitled"}</p>
            <p className="text-lg text-white/80">{book.author ? 
            <>{book.author.substring(0, 18)}<span className="text-transparent bg-gradient-to-r from-white/80 to-white/0 bg-clip-text">{book.author.substring(18, 24)}</span></>
            : "No Author"}</p>
            <div className="flex w-full mt-auto mb-0 space-between">
              <button onClick={() => appendBook(book.name, book.id)} className="ml-auto mr-0 secondary-button bg-gray-500/20">Add</button>
            </div>
          </div>
        </div>
      ))}


      <h2 className="pt-2 pr-4 mt-2 text-lg font-light text-white">Preview Books</h2>
      {items[0] ? null :
      <p className="w-full px-4 py-2 my-4 text-lg text-center text-white input-text">There are no books in this collection</p>
      }
      <List
        values={items}
        onChange={({ oldIndex, newIndex }) =>
          setItems(arrayMove(items, oldIndex, newIndex))
        }
        renderList={({ children, props, isDragged }) => (
          <ul
            {...props}
            style={{
              cursor: isDragged ? 'grabbing' : 'inherit'
            }}
          >
            {children}
          </ul>
        )}
        renderItem={({ value, props, index, isDragged, isSelected }) => (
          <li
            {...props}
            style={{
              ...props.style,
              margin: '0.5em 0em',
              listStyleType: 'none',
              cursor: isDragged ? 'grabbing' : 'grab',
            }}
            className="w-full px-4 py-4 my-2 text-white rounded-lg bg-wood-side-dark darker outline-1 outline-white/20 outline inner-shadow-main"
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div className="flex gap-4"><HamburgerIcon />
              {value.name ?
              <p className="text-lg">
                {value.name.substring(0, 17)}<span className="text-transparent bg-gradient-to-r from-white to-white/0 bg-clip-text">{value.name.substring(17, 22)}
                </span>
              </p>
              : "No Name"}
              </div>{' '}
              <button
                onClick={() => {
                  setItems(
                    typeof index !== 'undefined'
                      ? arrayRemove(items, index)
                      : items
                  );
                }}
                style={buttonStyles}
              >
                <RemovableIcon />
              </button>
            </div>
          </li>
        )}
      />

      <div className="flex gap-4 pt-4">
        <a href="/" className="ml-auto secondary-button">Cancel</a>
        <button onClick={() => {submit()}} className="mr-0 primary-button bg-green-500/20">Submit</button>
      </div>
      
    </div>
    </>
  )
};