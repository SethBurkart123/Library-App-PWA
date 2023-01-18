import PocketBase from 'pocketbase';
import React, { useState, useEffect, useRef } from 'react';
import Compressor from 'compressorjs';
import SpinePreviewImage from "../../../images/spine.jpg";
import CoverPreviewImage from "../../../images/spine.jpg";
import CreateCollection from './collection';
import global  from '../../../globalVars';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import Layout from '../../../components/layout';

export default function createBook() {
  const client = new PocketBase(global.pocketbaseDomain);
  
  /*
  2 individual file uploads that are required for the book images. 
  Then there is one more file upload that is optional. 
  It allows for the user to upload multiple images and remove them
  */

  if (!client.authStore.isValid) {
    window.location.href = '/signin';
  }

  const checkSubscription = async () => {
    const record = await client.collection('users').getOne(client.authStore.model.id, {});
    if (!record.createdSubscription) {
      window.location.href = '/';
    }
  }
  useEffect(() => {checkSubscription()}, [])

  const [spineImage, setSpineImage] = useState();
  const [coverImage, setCoverImage] = useState();
  const [otherImages, setOtherImages] = useState([]);
  const [CreateBook, setCreateBook] = useState(true);

  // handle preview for images
  const [SpinePreview, setSpinePreview] = useState();
  const [CoverPreview, setCoverPreview] = useState();
  const [OtherPreview, setOtherPreview] = useState([]);

  const OtherImages = useRef(null);
  const CoverImage = useRef(null);
  const SpineImage = useRef(null);

  const [bookName, setBookName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [bookPublisher, setBookPublisher] = useState('');
  const [datePublished, setDatePublished] = useState("1750-06-01");
  const [description, setDescription] = useState('');
  const [borrower, setBorrower] = useState('');
  const [borrowers, setBorrowers] = useState([]);
  const [borrowerSelection, setBorrowerSelection] = useState(-2);

  //create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
      // if there is no file selected, then return
      if(spineImage != null){
        // create the preview
        const objectUrl = URL.createObjectURL(spineImage)
        setSpinePreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
      }

      
  }, [spineImage])

  //create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
      // if there is no file selected, then return
      if(coverImage != null){
        // create the preview
        const objectUrl = URL.createObjectURL(coverImage)
        setCoverPreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
      }
  }, [coverImage])

  //create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
      // if there is no file selected, then return
      if (otherImages.length+1 != OtherPreview.lenth) {
        let temp = [];
        for (let i = 0; i < otherImages.length; i++) {
          const objectUrl = URL.createObjectURL(otherImages[i])
          temp.push(objectUrl);
        }
        setOtherPreview(temp);

      } else if(otherImages[otherImages.length-1] != null){
        // create the preview of last image
        const objectUrl = URL.createObjectURL(otherImages[otherImages.length-1]);
        setOtherPreview([...OtherPreview, objectUrl]);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
      }
  }, [otherImages])


  async function submit() {
    const data = {
    "name": bookName,
    "author": authorName,
    "publisher": bookPublisher,
    "publishDate": datePublished,
    "description": description,
    "user": client.authStore.model.id,
    "borrowedBy": borrower,
    };


    const Images = new FormData();
    Images.append("spineImage", spineImage);
    Images.append("coverImage", coverImage);
    otherImages.forEach((image) => {
      Images.append("otherImages", image);
    });
    createBook(data, Images);
  }

  async function createBook(data, images) {
    try {
      const record = await client.collection('book').create(data);
      const imagesRecord = await client.collection('book').update(record.id, images);
      //console.log(record)
      // redirect to search page
      navigate('/');
    } catch (err) {}
  }

  function remove(idx) {
    setOtherImages([
      ...otherImages.slice(0, idx),
      ...otherImages.slice(idx+1, otherImages.length)
    ]);
  }

  
  const handleCompressedSpine = (image) => {
      new Compressor(image, {
      quality: 0.6, // 0.6 can also be used, but its not recommended to go below.
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        // Use the compressed file to upload the images to your server.
        setSpineImage(compressedResult);
      }});
  };

  const handleCompressedCover = (image) => {
      new Compressor(image, {
      quality: 0.6, // 0.6 can also be used, but its not recommended to go below.
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        // Use the compressed file to upload the images to your server.
        setCoverImage(compressedResult);
      }});
  };

  function handleCompressedOther(image) {
      new Compressor(image, {
      quality: 0.6, // 0.6 can also be used, but its not recommended to go below.
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        // Use the compressed file to upload the images to your server.
        setOtherImages([...otherImages, compressedResult]);
      }});
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

  return(
    <Layout topbar={
      
      <div className="flex">
      {
        CreateBook ?
        <>
          <button className="border-b-white inner-shadow-main bg-black/20 backdrop-blur-md flex-1 w-full h-full px-4 pt-3 pb-2 text-xl font-bold text-center text-white border-b-2">Book</button>
          <button onClick={() => {setCreateBook(false)}} className="text-white/20 backdrop-blur-md bg-black/50 border-b-white/20 inner-shadow-main flex-1 w-full h-full px-4 pt-3 pb-2 text-xl font-bold text-center border-b-2">Collection</button>
        </>
        :
        <>
          <button onClick={() => {setCreateBook(true)}} className="text-white/20 bg-black/50 backdrop-blur-md border-b-white/20 inner-shadow-main flex-1 w-full h-full px-4 pt-3 pb-2 text-xl font-bold text-center border-b-2">Book</button>
          <button className="border-b-white inner-shadow-main bg-black/20 backdrop-blur-md flex-1 w-full h-full px-4 pt-3 pb-2 text-xl font-bold text-center text-white border-b-2">Collection</button>
        </>
      }
      </div>
      
    }>
    <div className="-mt-4">
      { CreateBook ?
      <div className="px-4">        
        <h2 className=" py-2 pr-4 text-lg font-light text-white">Book Title</h2>
        <input maxLength={100} type="text" className="input-text" value={bookName} onChange={(e) => setBookName(e.target.value)} />
        <h2 className=" py-2 pr-4 text-lg font-light text-white">Book Author <span className="italic text-gray-300">(optional)</span></h2>
        <input maxLength={100} className="input-text" type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
        <h2 className=" py-2 pr-4 text-lg font-light text-white">Book Publisher <span className="italic text-gray-300">(optional)</span></h2>
        <input maxLength={100} className="input-text" type="text" value={bookPublisher} onChange={(e) => setBookPublisher(e.target.value)} />
        <h2 className=" py-2 pr-4 text-lg font-light text-white">Date Published <span className="italic text-gray-300">(optional)</span></h2>
        <input className="input-text" type="date" value={datePublished} onChange={(e) => setDatePublished(e.target.value)} />
        <h2 className="py-2 pr-4 text-lg font-light text-white">Description <span className="italic text-gray-300">(optional)</span></h2>
        <textarea maxLength={5000} rows="18" type="text" className="input-text" onChange={(e) => setDescription(e.target.value)}/>
        <h2 className=" py-2 pr-4 text-lg font-light text-white">Book Borrower <span className="italic text-gray-300">(optional)</span></h2>
        <div className="bg-black/40 backdrop-blur-sm px-2 py-2 rounded-lg shadow-inner">
          <div className="relative">
            <input maxLength={128} className="input-text w-full px-4 py-2 rounded-lg outline-none" type="text" value={borrower} onChange={(e) => {setBorrower(e.target.value), getBorrowers(e.target.value), setBorrowerSelection(-2)}} />
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
              <div className="backdrop-blur-sm bg-white/5 text-md backdrop-brightness-110 border-white/80 flex w-full gap-1 px-1 py-1 mt-2 text-white border rounded-lg shadow-xl cursor-pointer" onClick={() => {setBorrower(''), setBorrowerSelection(-2)}}>
                <PlusCircleIcon className="h-6 pointer-events-none" />
                <p className="my-auto pointer-events-none select-none">{borrowerItem}</p>
              </div> 
              
              
              :
              borrowerItem == borrower ?
              null :
              <div id={idx.toString()} key={idx.toString()} className="backdrop-blur-sm bg-white/5 border-white/20 text-md flex w-full gap-1 px-1 py-1 mt-2 text-white border rounded-lg shadow-xl cursor-pointer" onClick={() => {setBorrower(borrowerItem), setBorrowerSelection(idx)}}>
                <PlusCircleIcon className="h-6 pointer-events-none" />
                <p className="my-auto pointer-events-none select-none">{borrowerItem}</p>
              </div>
            }
            </div>
          ))}
          </>
          : null}
        </div>
        
        <h2 className=" py-2 pr-4 text-lg font-light text-white">Main Images</h2>
        <div className="input-text flex gap-2 px-2 py-2 text-white outline-none">

            
            <div className="max-h-fit flex-1">
                {spineImage ?
                    <button className="inner-shadow-main border-white/20 backdrop-blur-sm backdrop-brightness-150 w-full px-4 py-2 mb-4 text-white bg-transparent border-2 rounded-lg shadow-inner" onClick={() => SpineImage.current.click()}>Set Spine Image</button>
                    :
                    <button className="inner-shadow-main border-white/20 backdrop-blur-sm backdrop-brightness-150 w-full px-4 py-2 mb-4 text-white bg-transparent border-2 rounded-lg shadow-inner" onClick={() => SpineImage.current.click()}>Set Spine Image</button>
                }
                
                <input type="file" id="spineImage" className="hidden" ref={SpineImage} accept="image/*" onChange={(event) => {handleCompressedSpine(event.target.files[0]);}} />
                {spineImage ?
                    <img alt="Spine Image" className="max-h-60 max-w-full mx-auto my-auto rounded-md" onClick={() => SpineImage.current.click()} src={SpinePreview} />
                    :
                    <img alt="No Spine Image" className="opacity-20 max-h-60 max-w-full mx-auto my-auto rounded-md" onClick={() => SpineImage.current.click()} src={SpinePreviewImage} />
                }
            </div>
            <div className="max-h-fit flex-1">
                {CoverImage ?
                    <button className="inner-shadow-main bg-white/0 border-white/20 backdrop-blur-sm backdrop-brightness-150 w-full px-4 py-2 mb-4 text-white border-2 rounded-lg shadow-inner" onClick={() => CoverImage.current.click()}>Set Cover Image</button>
                    :
                    <button className="inner-shadow-main bg-white/0 border-white/20 backdrop-blur-sm backdrop-brightness-150 w-full px-4 py-2 mb-4 text-white border-2 rounded-lg shadow-inner" onClick={() => CoverImage.current.click()}>Set Cover Image</button>
                }
                <input type="file" id="coverImage" className="hidden" ref={CoverImage} accept="image/*" onChange={(event) => {handleCompressedCover(event.target.files[0])}} />
                {coverImage ?
                    <img alt="Cover Image" onClick={() => CoverImage.current.click()} src={CoverPreview} className="max-h-60 max-w-full mx-auto my-auto rounded-md" />
                    :
                    <img alt="No Cover Image" onClick={() => CoverImage.current.click()} className="opacity-20 max-h-60 max-w-full mx-auto my-auto rounded-md" src={CoverPreviewImage} />
                }
            </div>
        </div>
        <h2 className="py-2 pr-4 text-lg font-light text-white">Other Images <span className="italic text-gray-300">(optional)</span></h2>
        <div className="input-text flex flex-wrap gap-4 px-4 py-2 text-white outline-none">
            <img alt="Add another image" className="image h-32 pointer-events-auto" src="../images/plus.svg" onClick={() => OtherImages.current.click()} />
            <input type="file" className="hidden" ref={OtherImages} accept="image/*" name="file" onChange={(event) => {handleCompressedOther(event.target.files[0])}} />
            {OtherPreview && OtherPreview.map(
            (item, idx) => (
            <div className="image-div" key={idx.toString()} id={idx.toString()}>
                <img className="max-h-32 image outline outline-white rounded-lg opacity-50" src={item} />
                <div onClick={() => remove(idx)} className="hidden_img">
                <svg className="mx-auto my-auto text-xl font-bold text-white" xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="-6 6 24 24" strokeWidth="1" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="currentColor" d="M10 10l4 4m0 -4l-4 4" />
                </svg>
                </div>
            </div>
            ))
            }

        </div>
        <div className="flex gap-4 pt-4">
            <a href="/" className="secondary-button ml-auto">Cancel</a>
            <button onClick={() => {submit()} } className="primary-button bg-green-500/20 mr-0">Submit</button>
        </div>
      </div>
      :
      <CreateCollection />
    }
          
    </div>
    </Layout>
  )
};