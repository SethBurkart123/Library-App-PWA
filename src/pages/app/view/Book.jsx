import { Image } from './Image';
import PocketBase from 'pocketbase';
import React, { useState, useEffect, useRef } from 'react';
import Compressor from 'compressorjs';
import Footer from '../../../components/footer';
import { useNavigate } from 'react-router-dom';
import SpinePreviewImage from "../../../images/spine.jpg";
import CoverPreviewImage from "../../../images/spine.jpg";
import noImage from '../../../images/noImage.jpeg';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import global, { getImageUrl, getThumbImageUrl } from '../../../globalVars';
import Layout from '../../../components/layout';


export default function ViewBook(props) {
  const navigate = useNavigate();
  const client = new PocketBase(global.pocketbaseUrl);
  /*
  2 individual file uploads that are required for the book images. 
  Then there is one more file upload that is optional. 
  It allows for the user to upload multiple images and remove them
  */

  //define some variables
  const [spineImage, setSpineImage] = useState();
  const [coverImage, setCoverImage] = useState();
  const [otherImages, setOtherImages] = useState([]);

  //const [isFilePicked, setIsFilePicked] = useState(false);
  const [isOtherImagesPicked, setIsOtherImagesPicked] = useState(false);
  const [isSpineImagePicked, setIsSpineImagePicked] = useState(false);

  const [editMode, setEditMode] = useState(false);

  // handle preview for images
  const [SpinePreview, setSpinePreview] = useState();
  const [CoverPreview, setCoverPreview] = useState();
  const [OtherPreview, setOtherPreview] = useState([]);

  const OtherImages = useRef(null);
  const CoverImage = useRef(null);
  const SpineImage = useRef(null);

  const [largeImage, setLargeImage] = useState('');
  const [largeImageBookID, setLargeImageBookID] = useState('');
  
  const [bookName, setBookName] = useState(props.data.name);
  const [authorName, setAuthorName] = useState(props.data.author);
  const [bookPublisher, setBookPublisher] = useState(props.data.publisher);
  const [datePublished, setDatePublished] = useState("1900-12-12");
  const [description, setDescription] = useState(props.data.description);

  const [borrower, setBorrower] = useState(props.data.borrowedBy);
  const [borrowers, setBorrowers] = useState([]);
  const [borrowerSelection, setBorrowerSelection] = useState(-2);

  const [bookCollectionPage, setBookCollectionPage] = useState(1);
  const [maxBookCollectionPages, setMaxBookCollectionPages] = useState(1);
  const [bookCollections, setBookCollections] = useState([]);

  const [displayImage, setDisplayImage] = useState(false);
  const [deletePrompt, setDeletePrompt] = useState(false);

  const temp1 = useRef(false);
  const collectionRef = useRef(null);
  const collectionObserver = useRef(null);

  //if not signed in ask user to sign in
  if (!client.authStore.isValid) {
    navigate('/signin');
  }

  //create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
      // if there is no file selected, then return
      if(spineImage != null){
        const objectUrl = URL.createObjectURL(spineImage);
        // create/update the preview
        setSpinePreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
      }
  }, [spineImage])

  //create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
      // if there is no file selected, then return
      if(coverImage != null){
        const objectUrl = URL.createObjectURL(coverImage);
        // create/update the preview
        setCoverPreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
      }
  }, [coverImage])

  //create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
      // check if preview of otherimages needs updating
      if (otherImages.length+1 != OtherPreview.lenth) {
        let temp = [];
        for (let i = 0; i < otherImages.length; i++) {
          temp.push(URL.createObjectURL(otherImages[i]));
        }
        setOtherPreview(temp);
      }
  }, [otherImages])


  useEffect(() => {
    // check if preview of otherimages needs updating
    if (temp1.current) return;
    temp1.current = true;

    setImg();
  }, [])

  useEffect(() => {
    getBookCollections(bookCollectionPage, props.data.id);
  }, [bookCollectionPage])

  async function SetCoverImageUrl(url) {
    let blob = await fetch(url)
      .then(r => r.blob());
    //setIsFilePicked(true);
    setCoverImage(blob);
  }

  async function SetSpineImageUrl(url) {
    let blob = await fetch(url)
      .then(r => r.blob());
    //setIsFilePicked(true);
    setSpineImage(blob);
  }

  async function SetOtherImagesUrl(images, index) {
    if (index >= 0 && otherImages.length == 0) {
      //for all images
      for (var i = 0; i <= index; i++) {
        //get image file
        let blob = await fetch(getImageUrl(props.data.id, images[i])).then(r => r.blob());
        //append to images array
        setOtherImages(prevState => ([...prevState, blob]));
      }
    }
  }

  function setImg() {
    //update publish date
    if (!props.data.publishDate == "") {setDatePublished(props.data.publishDate.split(' ')[0]);}
    
    //update cover image
    if (props.data.coverImage != "") {SetCoverImageUrl(getImageUrl(props.data.id, props.data.coverImage));}
    

    //update spine image
    if (props.data.spineImage != "") {SetSpineImageUrl(getImageUrl(props.data.id, props.data.spineImage));}
    
    //update other images
    SetOtherImagesUrl(props.data.otherImages, props.data.otherImages.length-1);
  }



  async function submit() {
    //construct payload
    const data = {
      "name": bookName,
      "author": authorName,
      "publisher": bookPublisher,
      "publishDate": datePublished,
      "description": description,
      "user": client.authStore.model.id,
      "borrowedBy": borrower
    };

    const Images = new FormData();
    Images.append("spineImage", spineImage);
    Images.append("coverImage", coverImage);

    otherImages.forEach((image) => {
      Images.append("otherImages", image, -1);
    });

    //update book
    updateBook(data, Images).then(() => {
      //reload to update search
      window.location.reload(false);
    });
  }

  async function updateBook(data, images) {
    try {
      //update text
      const record = await client.collection('book').update(props.data.id, data);
      //update images
      const imagesRecord = await client.collection('book').update(props.data.id, images);
    } catch (err) {
      console.log(err); //log error
    }
  }

  function remove(idx) {
    //remove image at index
    setOtherImages([
      ...otherImages.slice(0, idx),
      ...otherImages.slice(idx+1, otherImages.length)
    ]);
  }

  
  const handleCompressedSpine = (image) => {
    //compress and handle image
      new Compressor(image, {
      quality: 0.6, // 0.6 is minimum
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        setSpineImage(compressedResult);
        setIsSpineImagePicked(true);
      },
      });
  };

  const handleCompressedCover = (image) => {
      new Compressor(image, {
      quality: 0.6, // 0.6 is minimum
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        setCoverImage(compressedResult);
        //setIsFilePicked(true);
      },
      });
  };

  function handleCompressedOther(image) {
      new Compressor(image, {
      quality: 0.6, // 0.6 is minimum
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        setOtherImages([...otherImages, compressedResult]);
        setIsOtherImagesPicked(true);
      },
      });
  };

  const getBorrowers = async (searchRequest) => {
    try {
      const response = await client.collection('book').getList(1, 4, {
        filter: `borrowedBy ~ "${searchRequest}"`
      });
      var temp = []
      //reset page on search
      response.items.map((item) => {
        temp.push(item.borrowedBy)
      })
      setBorrowers([...new Set(temp)]);
    } catch(err){}
  }

  
  const getBookCollections = async (bookPage, bookId) => {
    if (bookPage <= maxBookCollectionPages) {
      try {
        //request books
        const response = await client.collection('collection').getList(bookPage, 2, {
          filter: `books ~ "${bookId}"`,
          expand: "books"
        });
        
        if (response.totalPages > 0) {
          setMaxBookCollectionPages(response.totalPages); //keep maxBookCollectionPages in sync
        }
        //reset page on search
        if (bookPage == 1) {
          setBookCollectionPage(1);
          setBookCollections(response.items);
        } else {
          //append books previous books
          setBookCollections(bookCollections.concat(response.items));
        }
      } catch(err) {console.log(err)} //log error
    }
    //if maxBookCollectionPages <1 then fix
    if (maxBookCollectionPages <= 0) {setMaxBookCollectionPages(1)}
  }

  useEffect(() => { //on collectionRef update
    // initiate observer api for page load on scroll
    collectionObserver.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setBookCollectionPage((p) => ( p + 1 ));
      }
      });
    }, {
      rootMargin: '0px 0px 0px 0px',
      threshold: 0,
    });
    // initialize the page variable
    setBookCollectionPage(1);
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
  
  return(
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
              const record = await client.collection('book').delete(props.data.id);
              window.location.href = "/";
              window.location.reload(true);
            }} className="warning-button">Delete</button>
          </div>
        </div>
      </div>
      : <></>}
      <Image image={largeImage} bookId={largeImageBookID} displayImage={displayImage} setDisplayImage={setDisplayImage} />
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
    
    { editMode ?
    <div className="px-4">
      <h2 className="py-2 pr-4 text-lg font-light text-white ">Book Title</h2>
      <input maxLength={100} type="text" className="input-text" value={bookName} onChange={(e) => setBookName(e.target.value)} />
      <h2 className="py-2 pr-4 text-lg font-light text-white ">Book Author</h2>
      <input maxLength={100} className="input-text" type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
      <h2 className="py-2 pr-4 text-lg font-light text-white ">Book Publisher</h2>
      <input maxLength={100} className="input-text" type="text" value={bookPublisher} onChange={(e) => setBookPublisher(e.target.value)} />
      <h2 className="py-2 pr-4 text-lg font-light text-white ">Date Published</h2>
      <input className="input-text" type="date" value={datePublished} onChange={(e) => setDatePublished(e.target.value)} />
      <h2 className="py-2 pr-4 text-lg font-light text-white">Description</h2>
      <textarea maxLength={5000} rows="18" type="text" className="input-text" placeholder="" value={description} onChange={(e) => setDescription(e.target.value)} />
      <h2 className="py-2 pr-4 text-lg font-light text-white ">Book Borrower <span className="italic text-gray-300">(optional)</span></h2>
      <div className="px-2 py-2 rounded-lg shadow-inner bg-black/40 backdrop-blur-sm">
        <div className="relative">
          <input maxLength={128} className="input-text" type="text" value={borrower} onChange={(e) => {setBorrower(e.target.value), getBorrowers(e.target.value), setBorrowerSelection(-2)}} />
          <svg onClick={() => {setBorrower(""), getBorrowers(""), setBorrowerSelection(-2)}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8.5 h-8.5 absolute top-1 right-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        {borrower != '' ?
        <>
        {borrowers.map((borrowerItem, idx) => (
          <div id={idx.toString()} key={idx.toString()}>
          {borrowerSelection == idx ?
            borrowerItem == borrower ? null :
            <div className="flex w-full gap-1 px-1 py-1 mt-2 text-white border rounded-lg shadow-xl cursor-pointer backdrop-blur-sm bg-white/5 text-md backdrop-brightness-110 border-white/80" onClick={() => {setBorrower(''), setBorrowerSelection(-2)}}>
              <PlusCircleIcon className="h-6 pointer-events-none" />
              <p className="my-auto pointer-events-none select-none">{borrowerItem}</p>
            </div> 
            
            :
            borrowerItem == borrower ?
            null :
            <div id={idx.toString()} key={idx.toString()} className="flex w-full gap-1 px-1 py-1 mt-2 text-white border rounded-lg shadow-xl cursor-pointer backdrop-blur-sm bg-white/5 border-white/20 text-md" onClick={() => {setBorrower(borrowerItem), setBorrowerSelection(idx)}}>
              <PlusCircleIcon className="h-6 pointer-events-none" />
              <p className="my-auto pointer-events-none select-none">{borrowerItem}</p>
            </div>
          }
          </div>
        ))}</>
        : null}
      </div>
      
      <h2 className="py-2 pr-4 text-lg font-light text-white ">Main Images</h2>
      <div className="flex gap-2 px-2 py-2 text-white input-text">

          
          <div className="flex-1 max-h-fit">
              {spineImage ?
                  <button className="w-full px-4 py-2 mb-4 text-white border-2 rounded-lg shadow-inner inner-shadow-main bg-white/0 border-white/20 backdrop-blur-sm backdrop-brightness-150" onClick={() => SpineImage.current.click()}>Change Spine Image</button>
                  :
                  <button className="w-full px-4 py-2 mb-4 text-white border-2 rounded-lg shadow-inner inner-shadow-main bg-white/0 border-white/20 backdrop-blur-sm backdrop-brightness-150" onClick={() => SpineImage.current.click()}>Add Spine Image</button>
              }
              
              <input type="file" id="spineImage" className="hidden" ref={SpineImage} accept="image/*" onChange={(event) => {handleCompressedSpine(event.target.files[0]);}} />
              {spineImage ?
                  <img className="max-w-full mx-auto my-auto rounded-md max-h-60" onClick={() => SpineImage.current.click()} src={SpinePreview} />
                  :
                  <img className="max-w-full mx-auto my-auto rounded-md opacity-20 max-h-60" onClick={() => SpineImage.current.click()} src={SpinePreviewImage} />
              }
          </div>
          <div className="flex-1">
              {CoverImage ?
                  <button className="w-full px-4 py-2 mb-4 text-white border-2 rounded-lg shadow-inner inner-shadow-main bg-white/0 border-white/20 backdrop-blur-sm backdrop-brightness-150" onClick={() => CoverImage.current.click()}>Change Cover Image</button>
                  :
                  <button className="w-full px-4 py-2 mb-4 text-white border-2 rounded-lg shadow-inner inner-shadow-main bg-white/0 border-white/20 backdrop-blur-sm backdrop-brightness-150" onClick={() => CoverImage.current.click()}>Add Cover Image</button>
              }
              <input type="file" id="coverImage" className="hidden" ref={CoverImage} accept="image/*" onChange={(event) => {handleCompressedCover(event.target.files[0])}} />
              {coverImage ?
                  <img onClick={() => CoverImage.current.click()} className="max-w-full mx-auto my-auto rounded-md max-h-60" src={CoverPreview} />
                  :
                  <img onClick={() => CoverImage.current.click()} className="max-w-full mx-auto my-auto rounded-md opacity-20 max-h-60" src={CoverPreviewImage} />
              }
          </div>
      </div>
      <h2 className="py-2 pr-4 text-lg font-light text-white ">Other Images</h2>
      <div className="flex flex-wrap gap-4 px-4 py-2 text-white rounded-lg input-text">
        <img className="h-32 pointer-events-auto image" src="../images/plus.svg" onClick={() => OtherImages.current.click()} />
        <input type="file" className="hidden" ref={OtherImages} accept="image/*" name="file" onChange={(event) => {handleCompressedOther(event.target.files[0])}} />
        {OtherPreview && OtherPreview.map(
          (item, idx) => (
            <div className="image-div" key={idx.toString()} id={idx.toString()}>
              <img className="rounded-lg opacity-50 max-h-32 image outline outline-white" src={item} />
              <div onClick={() => remove(idx)} className="hidden_img">
              <svg className="mx-auto my-auto text-xl font-bold text-white" xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="-6 6 24 24" strokeWidth="1" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="currentColor" d="M10 10l4 4m0 -4l-4 4" />
              </svg>
            </div>
        </div>
        ))}
      </div>
      <div className="flex justify-between pt-4">
        <a className="warning-button" onClick={() => {setDeletePrompt(true)}}>Delete</a>
        <div className="flex justify-end">
          <a onClick={() => setEditMode(false)} className="mr-4 cursor-pointer select-none secondary-button">Cancel</a> 
          <button onClick={() => {submit()} } className="mr-0 select-none primary-button">Submit</button>
        </div>
      </div>
      
    </div>




    :




    <>
      {/* Scrollable Book Images */}
      <div className="z-10 flex items-baseline gap-4 mb-4 overflow-x-scroll justify-right snap-mandatory snap-x">
        <div className="z-50 text-transparent select-none min-w-max">AGHHHHHHHHHHHH!!! SAVE ME!!!!!</div>
        <div className="z-20 snap-center min-w-max" onClick={props.data.coverImage ? () => {setLargeImage(props.data.coverImage), setLargeImageBookID(props.data.id), setDisplayImage(true)} : null}>
          <img className="h-64 rounded-md shadow-2xl cursor-pointer shadow-black" src={props.data.coverImage ? getImageUrl(props.data.id, props.data.coverImage) : props.data.spineImage ? null : noImage} />
        </div>
        {props.data.spineImage ?
        <div className="z-20 snap-center min-w-max" onClick={props.data.spineImage ? () => {setLargeImage(props.data.spineImage), setLargeImageBookID(props.data.id), setDisplayImage(true)} : null}>
          <img className="h-64 rounded-md shadow-2xl cursor-pointer shadow-black" src={props.data.spineImage ? getImageUrl(props.data.id, props.data.spineImage) : props.data.coverImage ? null : noImage} />
        </div> : null}
        {props.data.otherImages.map((image, idx) => (
          <div key={idx.toString()} id={idx.toString()} className="z-20 snap-center min-w-max" onClick={image ? () => {setLargeImage(image), setLargeImageBookID(props.data.id), setDisplayImage(true)} : null}>
            <img className="h-64 rounded-md shadow-2xl cursor-pointer shadow-black" src={image ? getImageUrl(props.data.id, image) : noImage} />
          </div>
        ))}
        <div className="z-50 text-transparent select-none min-w-max">AGHHHHHHHHHHHH!!! SAVE ME!!!!!</div>
      </div>
      <div className="px-4 pb-32 bg-black/40 drop-shadow-strong">
        <h2 className="text-3xl text-white">{props.data.name ? props.data.name : <span className="text-gray-100">Unknown Title</span>}
        <span className="font-light text-gray-300"> ({props.data.publishDate.split(' ')[0].split('-')[0]})</span></h2>
        <h2 className="text-2xl font-light text-white">Author: {props.data.author ? props.data.author : <>Unknown</>}</h2>
        <h2 className="pt-2 font-light text-gray-300 text-md">Published in {props.data.publishDate.split(' ')[0].split('-')[2]}/{props.data.publishDate.split(' ')[0].split('-')[1]}/{props.data.publishDate.split(' ')[0].split('-')[0]}</h2>
        <h2 className="font-light text-gray-300 text-md">by {props.data.publisher ? props.data.publisher : <>Unknown</>}</h2>
        {borrower ?
        <div className="pt-4 mt-4 border-t border-t-white">
          <h2 className="text-xl">Borrowed By: {borrower}</h2>
        </div> : <></> }
        <p className="pt-4 mt-4 font-light text-white border-t shadow-md text-md border-t-white">{props.data.description}</p>
        {bookCollections.length == 0 ? 
        <p className="w-full py-4 mt-8 text-center text-white rounded-lg bg-black/40 backdrop-blur-sm inner-shadow-main">This book is not in any collections
        </p> : <></>}
      </div>
      {bookCollections.map((collection, idx) => (
        <div onClick={() => {setCollectionData(collection), setCollectionMenu(true)}} className="flex flex-col -mt-12 cursor-pointer " style={{minHeight: 120}} key={idx.toString()} id={idx.toString()}>
          <div className="z-10 flex items-baseline gap-4 mb-4 overflow-x-scroll justify-right snap-mandatory snap-x">
            <div className="z-50 text-transparent select-none min-w-max">AGHHHHH!!! SAVE ME!!!!!</div>
            { collection.expand.books ? collection.expand.books.map((book, idx) => {return(
              <div key={idx.toString()} id={idx.toString()} className="z-50 snap-center min-w-max">
              {book.coverImage ?
                <img key={idx.toString()} id={idx.toString()} alt="Book cover image" className="my-4 rounded-md cursor-pointer pointer-events-none h-28 z-60 touch shadow-book" src={getThumbImageUrl(book.id, book.coverImage)} />
                :
                <img key={idx.toString()} id={idx.toString()} alt="No book cover image" className="my-4 rounded-md cursor-pointer pointer-events-none h-28 z-60 touch shadow-book" src={noImage} />}
              </div>
            )}) : null }
            <div className="z-50 text-transparent select-none min-w-max">AGHHHHH!!! SAVE ME!!!!!</div>
          </div>
          {collection.expand.books ? 
            <div className="pl-4 text-xl text-white shelf"><p className="absolute select-none bottom-4 text-shadow left-2">{collection.name ? collection.name : "No name"}</p></div>
            :
            <div className="pl-4 text-xl text-white shelf mt-36"><p className="absolute select-none bottom-4 text-shadow left-2">{collection.name ? collection.name : "No name"}</p></div>
          }
        </div>
      ))}

      <div ref={collectionRef}></div>
    </>
    }
  </Layout>
  );
};

