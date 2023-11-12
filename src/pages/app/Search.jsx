import React, {
  useState,
  useEffect,
  useRef,
  Suspense,
  lazy,
} from 'react';
import PocketBase from 'pocketbase';
import { getThumbImageUrl, global } from '../../globalVars';
import { Borrower } from './../../components/borrower';
import { Author } from '../../components/author';
import noImage from '../../images/noImage.jpeg';
import Layout from '../../components/layout';

const CollectionMenuItem = lazy(() => import('./view/Collection'));
const BookMenuItem = lazy(() => import('./view/Book'));
const delay = ms => new Promise(res => setTimeout(res, ms));
const searchParams = new URLSearchParams(window.location.search);

export default React.memo(function Search() {
  const client = new PocketBase(global.pocketbaseDomain);
  //if user is logged out,
  //redirect to signIn
  if (!client.authStore.isValid) {
    window.location.href = '/signin';
  }
  const checkSubscription = async () => {
    const record = await client.collection('users').getOne(client.authStore.model.id, {});
    if (!record.createdSubscription) {
      if (!record.hasSub) {
        window.location.href = global.homepageDomain+'/pricing';
      } else {
        window.location.href = '/payment-redirect?paymentPlan='+record.subscriptionPlan;
      }
    }
  }

  const check = async () => {
    const success = searchParams.get('success');
    if (success == 'true') {
      await delay(5000);
      checkSubscription();
    } else {
      checkSubscription();
    }
  }
    
  //initialise variables
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(false);

  const [borrower, setBorrower] = useState("");
  const [borrowerCheckbox, setBorrowerCheckbox] = useState(false);
  const [author, setAuthor] = useState("");

  const [bookPage, setBookPage] = useState(1);
  const [collectionPage, setCollectionPage] = useState(1);
  
  const [maxBookPages, setMaxBookPages] = useState(2);
  const [maxCollectionPages, setMaxCollectionPages] = useState(2);
  
  const [books, setBooks] = useState([]);
  const [collections, setCollections] = useState([]);

  const [bookMenu, setBookMenu] = useState(false);
  const [collectionMenu, setCollectionMenu] = useState(false);

  const [bookData, setBookData] = useState({});
  const [collectionData, setCollectionData] = useState({});
  
  const collectionRef = useRef(null);
  const bookRef = useRef(null);
  
  const collectionObserver = useRef(null);
  const bookObserver = useRef(null);
  const top = useRef(null)


  useEffect(() => {
    top.current.scrollIntoView({ block: "end" })
    check();
  }, []);


  const getCollections = async (CollectionPage) => {
    if (CollectionPage <= maxCollectionPages) {
      try {
        // cancel previous search requests
        client.cancelRequest('collectionSearch');
        //request collections
        // cancel previous search requests
        client.cancelRequest('collectionSearch');
        //request collections
        const response = await client.collection('collection').getList(CollectionPage, 7, {
          filter: `name ~ "${search}"`,
          expand: "books",
          $cancelKey: `collectionSearch`
        });

        if (response.totalPages > 0) {
          setMaxCollectionPages(response.totalPages)
        }
        //reset page on search
        if (CollectionPage == 1) {
          setCollectionPage(1);
          setCollections(response.items);
        } else {
          setCollections(collections.concat(response.items));
        }
      } catch(err) {}
    }
    if (maxCollectionPages <= 0) {
      setMaxCollectionPages(1)
    }
   
  }


  const getBooks = async (bookPage) => {
    if (bookPage <= maxBookPages) {
      try {
        // cancel previous search requests
        client.cancelRequest('bookSearch');
        // cancel previous search requests
        client.cancelRequest('bookSearch');
        //request books
        const response = await client.collection('book').getList(bookPage, 7, {
          filter: `name ~ "${search}" && author ~ "${author}" && borrowedBy ~ "${borrower}" ${borrowerCheckbox ? "&& borrowedBy != null" : ""}`,
          sort: "-created",
          $cancelKey: `bookSearch`
        });
        
        if (response.totalPages > 0) {
          setMaxBookPages(response.totalPages); //keep maxBookPages in sync
        }
        //reset page on search
        if (bookPage == 1) {
          setBookPage(1);
          setBooks(response.items);
        } else {
          //append books previous books
          setBooks(books.concat(response.items));
        }
      } catch(err) {}
    }
    //if maxBookPages <1 then fix
    if (maxBookPages <= 0) {setMaxBookPages(1)}
  }

  useEffect(() => {
    getBooks(1);
  }, [borrowerCheckbox]);

  useEffect(() => {
    //on bookPage change,
    //update books
    getBooks(bookPage);
  }, [bookPage]);
  
  useEffect(() => {
    //on CollectionPage change,
    //update collections
    getCollections(collectionPage);
  }, [collectionPage]);


  useEffect(() => {
    // reset scrollbar position
    top.current.scrollIntoView({ block: "end" })
    // request the collections
    getCollections(1);
    // request the books
    getBooks(1);
  }, [search]);

    

  useEffect(() => { //on bookRef update
    // initiate observer api for page load on scroll
    bookObserver.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setBookPage((p) => ( p + 1 ));
      }
      });
    }, {
      rootMargin: '0px 0px 500px 0px',
      threshold: 0,
    });
    setBookPage(1); // initialize the page variable
    
    if (bookRef.current) { 
      //if bookref true,
      //observe the last book ref
      bookObserver.current.observe(bookRef.current);
    }
    return () => {
      if (bookObserver.current) {
      bookObserver.current.disconnect();
      }
    };
  }, [bookRef]);



  useEffect(() => { //on collectionRef update
    // initiate observer api for page load on scroll
    collectionObserver.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setCollectionPage((p) => ( p + 1 ));
      }
      });
    }, {
      rootMargin: '0px 0px 500px 0px',
      threshold: 0,
    });
    // initialize the page variable
    setCollectionPage(1);
    // observe the last book ref
    if (collectionRef.current) {
      collectionObserver.current.observe(collectionRef.current);
    }
    return () => {
      if (collectionObserver.current) {
      collectionObserver.current.disconnect();
      }
    };
  }, [collectionRef]);

  const [currentIdx, setCurrentIdx] = useState(0);
  function parseBack(idx, bookData) {
    var temp = [];
    books.map((book, id) => {
      if(id === idx) {
        temp.push(bookData);
      } else {
        temp.push(book);
      }
    })
    //
    setBooks(temp);
  }

  return (
    <>
      { bookMenu || collectionMenu ?
      <>
        {bookMenu ? 
        <Suspense fallback={
          <div className="w-screen h-screen bg-wood-side-dark">   
            <div className="profile-main-loader">
              <div className="loader">
                <svg className="circular-loader"viewBox="25 25 50 50" >
                  <circle className="loader-path" cx="50" cy="50" r="20" fill="none" stroke="#70c542" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        }>
          <BookMenuItem
          backFunction={setBookMenu}
          setBookData={setBookData} 
          setCollectionMenu={setCollectionMenu}
          setCollectionData={setCollectionData}
          currentIdx={currentIdx}
          parseBack={parseBack}
          data={bookData}
        />
        </Suspense>
        : null }
        {collectionMenu && !bookMenu ? 
        <Suspense fallback={
          <div className="w-screen h-screen bg-wood-side-dark">   
            <div className="profile-main-loader">
              <div className="loader">
                <svg className="circular-loader"viewBox="25 25 50 50" >
                  <circle className="loader-path" cx="50" cy="50" r="20" fill="none" stroke="#70c542" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        }>
        <CollectionMenuItem
          backFunction={setCollectionMenu}
          data={collectionData}
          setBookData={setBookData}
          setBookMenu={setBookMenu}
          setCurrentIdx={setCurrentIdx}
          />
          </Suspense> : null }
      </> :
      <Layout topbar={
        <div className="px-2 pt-2 transition fully-rounded bg-black/50" style={{boxShadow: "0px 13px 16px -3px rgba(0,0,0,1)"}}>
          <div className="relative flex w-full border-2 rounded-full bg-black/20 backdrop-blur-md border-white/20 inner-shadow-main">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className='absolute z-10 text-gray-300 top-3 left-3 w-7 h-7'>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full px-3 py-2 pl-12 text-2xl font-medium text-white bg-transparent border-none rounded-full outline-white/20 focus:brightness-110 placeholder-white/60 backdrop-blur-2xl" placeholder="Search" />
            <div onClick={() => filters ? setFilters(false) : setFilters(true)} className="absolute px-1 rounded-lg cursor-pointer text-white/50 top-2 right-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-9 h-9">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </div>
          </div>
          <div className={filters ? "px-6" : "hidden"}>
            <div className="w-full border-2 border-t-0 backdrop-blur-md bg-black/30 inner-shadow-main rounded-b-2xl shadow-strong border-white/20" style={{boxShadow: "0px 13px 16px -3px rgba(0,0,0,1)"}}>
          
            {/* Book Borrower */}
            <h2 className="px-5 py-1 pt-3 text-lg font-light text-gray-500">Borrowed by:</h2>
            <Borrower getBooks={getBooks} className="px-2" setBorrower={setBorrower} borrower={borrower} placeholder="" />
            
            {/* Book Author */}
            <h2 className="px-5 py-1 pt-3 text-lg font-light text-gray-500">Author:</h2>
            <Author getBooks={getBooks} className="px-2 mb-1" setAuthor={setAuthor} author={author} placeholder="" />
            
            {/* Book Borrower Checkbox */}
            <div onClick={() => borrowerCheckbox ? setBorrowerCheckbox(false) : setBorrowerCheckbox(true)}
            className="flex items-center gap-2 px-4 pt-2 mb-4 cursor-pointer">
              <input
                type="checkbox"
                className="p-3 rounded-lg outline-none pointer-events-nones darker inner-shadow-main"
                id="borrower-checkbox"
                name="borrower-checkbox"
                onChange={e => setBorrowerCheckbox(e.target.checked)}
                checked={borrowerCheckbox}
              />
              <label className="py-1 text-lg font-light text-gray-500 align-middle pointer-events-none select-none">Show only borrowed books</label>
            </div>
          </div>
        </div>
        </div>
      }>
        {collections.length != 0 ? <div className="mb-16" ref={top}></div> : <div className="mb-4" ref={top}></div>}
        {author == "" && borrower == "" ? collections.map((collection, idx) => (
          <div onClick={() => {setCollectionData(collection), setCollectionMenu(true)}} className="flex flex-col -mt-12 cursor-pointer " style={{minHeight: 120}} key={idx.toString()} id={idx.toString()}>
            <div className="z-10 flex items-baseline gap-4 mb-4 overflow-x-scroll justify-right snap-mandatory snap-x">
              <div className="z-50 text-transparent select-none min-w-max">AGHHHHHHHHHHHH!!! SAVE ME!!!!!</div>
              { collection.expand.books ? collection.expand.books.map((book, idx) => {return(
                <div key={idx.toString()} id={idx.toString()} className="z-50 snap-center min-w-max">
                {book.coverImage ?
                  <img key={idx.toString()} id={idx.toString()} alt="Book cover image" className="h-40 my-4 rounded-md cursor-pointer pointer-events-none z-60 touch shadow-book" src={getThumbImageUrl(book.id, book.coverImage)} />
                  :
                  <img key={idx.toString()} id={idx.toString()} alt="No book cover image" className="h-40 my-4 rounded-md cursor-pointer pointer-events-none z-60 touch shadow-book" src={noImage} />}
                </div>
              )}) : null }
              <div className="z-50 text-transparent select-none min-w-max">AGHHHHHHHHHHHH!!! SAVE ME!!!!!</div>
            </div>
            {collection.expand.books ? 
              <div className="pl-4 text-xl text-white shelf"><p className="absolute select-none bottom-4 text-shadow left-2">{collection.name ? collection.name : "No name"}</p></div>
              :
              <div className="pl-4 text-xl text-white shelf mt-36"><p className="absolute select-none bottom-4 text-shadow left-2">{collection.name ? collection.name : "No name"}</p></div>
            }
          </div>
        )) : null}
        <div ref={collectionRef}></div>
        {/*books[0] ? <h2 className="w-full px-4 py-2 mb-4 -mt-16 text-xl border-b-2 text-white/60 bg-black/50 border-b-white/60">Books</h2> : null */}
        <div className="flex flex-col gap-2" style={collections.length != 0 ? {marginTop: "-0rem"} : {}}>
        {books.map((book, idx) => (
        <div key={idx.toString()} id={idx.toString()}>
          {book.borrowedBy.length == 0 ?
          <BookMenuItem2 className="flex gap-1 px-2 py-2 mx-2 rounded-lg cursor-pointer bg-black/40 backdrop-blur-sm outline-white/10 outline" setBookData={setBookData} book={book} setBookMenu={setBookMenu} setCurrentIdx={setCurrentIdx} idx={idx} /> :
          <BookMenuItem2 className="flex gap-1 px-2 py-2 mx-2 border-4 border-double rounded-lg cursor-pointer backdrop-blur-lg bg-black/60 border-white/50 brightness-50" setBookData={setBookData} book={book} setBookMenu={setBookMenu} setCurrentIdx={setCurrentIdx} idx={idx} />
          }
        </div>
        ))}
        </div>
        {books.length > 1 || collections.length > 1 ? null : <div className=''></div>}
        <div ref={bookRef}></div>
      </Layout>
      }
    </>
  );
});


function BookMenuItem2({setBookData, book, setBookMenu, setCurrentIdx, idx, className}) {
  return <a onClick={() => { setBookData(book), setBookMenu(true), setCurrentIdx(idx); } } className={className}>
    <div className="grid w-2/3 select-none place-items-center" style={{ minHeight: "4rem" }}>
      {book.coverImage ?
        <img alt="Book cover image" className="rounded-md max-h-32" src={getThumbImageUrl(book.id, book.coverImage)} />
        :
        <img alt="No book cover image" className="rounded-md max-h-32" src={noImage} />}
    </div>
    <div className="flex flex-col w-full pl-1 select-none">
      <p className="text-xl text-white ">{book.name ?
        <>{book.name.substring(0, 18)}<span className="text-transparent bg-gradient-to-r from-white to-white/0 bg-clip-text">{book.name.substring(18, 24)}</span></>
        : "Untitled"}</p>
      <p className="text-lg text-white/80">{book.author ?
        <>{book.author.substring(0, 18)}<span className="text-transparent bg-gradient-to-r from-white/80 to-white/0 bg-clip-text">{book.author.substring(18, 24)}</span></>
        : "No Author"}</p>
      <p className="text-sm text-white/60">{book.description ?
        <>{book.description.substring(0, 90)}<span className="text-transparent bg-gradient-to-r from-white/60 to-white/0 bg-clip-text">{book.description.substring(90, 100)}</span></>
        : "No Description"}</p>
      <p className="mt-auto font-medium text-white/80 text-md">{book.borrowedBy ?
        <>Borrowed By: {book.borrowedBy.substring(0, 90)}<span className="text-transparent bg-gradient-to-r from-white/60 to-white/0 bg-clip-text">{book.borrowedBy.substring(90, 100)}</span></>
        : ""}</p>
    </div>
  </a>;
}