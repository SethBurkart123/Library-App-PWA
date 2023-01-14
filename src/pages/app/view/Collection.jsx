import { List, arrayMove, arrayRemove } from 'react-movable';
import noImage from '../../../images/noImage.jpeg';
import global, { getImageUrl } from "../../../globalVars";
import PocketBase from 'pocketbase';
import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout';

export default function viewCollection(props) {
  const client = new PocketBase(global.pocketbaseUrl);
  const [deletePrompt, setDeletePrompt] = useState(false);
  const [editMode, setEditMode] = useState(false);
  return (
    <Layout overlay={
      <>
        { deletePrompt ?
          <div className="absolute bottom-0 left-0 z-50 grid items-center justify-center w-screen h-screen transition bg-black/40">
            <div className="px-4 py-2 text-white rounded-lg bg-wood-side-dark outline-white/20 outline-2 outline">
              <h2 className="text-xl font-semibold">Are you sure?</h2>
              <p className="font-light">This will delete this collection forever!</p>
              <div className="flex justify-end gap-4 mt-2">
                <button onClick={() => setDeletePrompt(false)} className="secondary-button">Cancel</button>
                <button onClick={ async () => {
                  const record = await client.collection('collection').delete(props.data.id);
                  window.location.href = "/";
                  window.location.reload(true);
                }} className="warning-button">Delete</button>
              </div>
            </div>
          </div>
          : <></>}
        </>
        }
        topbar={
        <div className="sticky top-0 left-0 z-50 flex justify-between px-4 py-2 text-2xl font-medium text-white border-b-2 bg-black/40 border-b-white/20 backdrop-blur-md">
          <div className="flex gap-2 overflow-hidden cursor-pointer" onClick={() => props.backFunction(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-9 h-9">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
            <h1 className="my-auto whitespace-nowrap">{props.data.name}</h1>
          </div>
          <a onClick={() => {editMode ? setEditMode(false) : setEditMode(true) /*, setImg()*/}} className="flex gap-2 cursor-pointer">
            <h2 className="pl-4 my-auto text-2xl font-light text-center pointer-events-none">{editMode ? "Cancel" : "Edit"}</h2>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6 my-auto">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
          </a>
        </div>
        }>
    {editMode ?
    <EditCollection client={client} setDeletePrompt={setDeletePrompt} setEditMode={setEditMode} data={props.data} />
    :
    <>
    <div className='flex flex-col-reverse'>
      
    <div className="z-10 text-xl text-white shelf"></div>
    <div className="z-10 flex items-baseline gap-4 mb-4 overflow-x-scroll justify-right snap-mandatory snap-x">
      <div className="z-50 text-transparent select-none min-w-max">AGHHHHHHHHHHHH!!! SAVE ME!!!!!</div>
      { props.data.expand.books ? props.data.expand.books.map((book, idx) => {return(
        <div key={idx.toString()} id={idx.toString()} className="z-50 snap-center min-w-max">
          {book.coverImage ?
          <img className="h-64 rounded-md shadow-2xl cursor-pointer shadow-black" src={book.coverImage ? getImageUrl(book.id, book.coverImage) : noImage} onClick={() => {props.setBookData(book), props.setBookMenu(true), props.setCurrentIdx(50)}} />
          :
          <img className="h-64 rounded-md shadow-2xl cursor-pointer shadow-black" src={noImage} onClick={() => {props.setBookData(book), props.setBookMenu(true), props.setCurrentIdx(50)}} />}
        </div>
      )}) : null }
      <div className="z-50 text-transparent select-none min-w-max">AGHHHHHHHHHHHH!!! SAVE ME!!!!!</div>
    </div>
    </div>
    
    <div>
      <h2 className="mx-4 text-4xl font-light text-white">{props.data.name}</h2>
      <p className="mx-4 text-white">{props.data.description}</p>
    </div>
    </>
    }

    </Layout>
  )
}

function EditCollection(props) {
  const client = props.client;
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const [search, setSearch] = useState('');
  
  const [books, setBooks] = useState([]);
  const [items, setItems] = useState([]);

  const ranOnce = useRef(false);


  const getBooks = async (searchRequest) => {
    try {
      const response = await client.collection('book').getList(1, 4, {
        filter: `name ~ "${searchRequest}"`
      });
      //reset page on search
      setBooks(response.items);
    } catch(err){
      //handle error
    }
  }

  function handleChange(event) {
    setSearch(event.target.value);
    getBooks(event.target.value);
  }

  function appendBook(name, id) {
    setItems((e) => [...e, {name: name, id: id}])
  }

  const submit = async () => {
    let itemsArray = [];
    if (items) {
      itemsArray = items.map(({id}) => (id));
    }

    const data = {
      "user": client.authStore.model.id,
      "books": itemsArray,
      "name": name,
      "description": description
    };

    try {
      const record = await client.collection('collection').update(props.data.id, data);

      //reload to update search
      window.location.reload(false);
    } catch(err) {
      alert("Error: " + err.message);
    }
  }

  useEffect(() => {
    // ensure to run useEffect only once
    if (ranOnce.current) return;
    ranOnce.current = true;
    // Set collection values when enabling edit mode
    setName(props.data.name);
    setDescription(props.data.description);
    if (props.data.expand.books != undefined) {
      props.data.expand.books.map((book) => {
        appendBook(book.name, book.id)
      });
    }
  }, [])

  return(
    <div className="px-4 text-white">
      
      <h2 className="py-2 pr-4 text-lg font-light text-white ">Collection Name</h2>
      <input maxLength={100} type="text" className="input-text" value={name} onChange={(e) => setName(e.target.value)} />
      <h2 className="py-2 pr-4 text-lg font-light text-white">Description</h2>
      <textarea maxLength={5000} rows="18" type="text" autoComplete='off' className="input-text" placeholder="" value={description} onInput={(e) => { console.log(e.target.value); setDescription(e.target.value) }} onChange={(e) => { console.log(e.target.value); setDescription(e.target.value) }} />
      
      <h2 className="py-2 pr-4 text-lg font-light text-white">Add Books</h2>
      <input type="text" value={search} onChange={handleChange} className="flex items-baseline justify-center input-text" placeholder='Search' />
      {books ? books.map((book, idx) => (
        <div className="flex gap-1 px-2 py-2 my-2 rounded-lg bg-black/40" key={idx.toString()} id={idx.toString()}>
          <div className="min-w-48" style={{
            minHeight: "6rem",
            minWidth: "5rem"
            }}>
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
      )) : null}


      <h2 className="pt-2 pr-4 mt-2 text-lg font-light text-white">Preview Books</h2>
      {items[0] ? null :
      <p className="w-full px-4 py-2 my-4 text-lg text-center text-white rounded-lg bg-black/40">There are no books in this collection</p>
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
              boxShadow: '0px 0px 0px 0.95px rgba(127,127,127,1)'
            }}
            className="w-full px-4 py-4 my-2 text-white rounded-lg backdrop-blur-sm bg-black/60 inner-shadow-main"
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
        <a className="warning-button" onClick={() => {props.setDeletePrompt(true), console.log("test")}}>Delete</a>
        <a onClick={() => props.setEditMode(false)} className="ml-auto secondary-button">Cancel</a>
        <button onClick={() => {submit()}} className="mr-0 primary-button">Submit</button>
      </div>
    </div>
  )
};







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
