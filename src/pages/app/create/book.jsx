import PocketBase from 'pocketbase';
import React, { useState, useEffect, useRef } from 'react';
import Compressor from 'compressorjs';
import { useNavigate } from 'react-router-dom';
import SpinePreviewImage from "../../../images/spine.jpg";
import CoverPreviewImage from "../../../images/spine.jpg";
import CreateCollection from './collection';
import global  from '../../../globalVars';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import Layout from '../../../components/layout';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function createBook() {
  const client = new PocketBase(global.pocketbaseDomain);
  
  /*
  2 individual file uploads that are required for the book images. 
  Then there is one more file upload that is optional. 
  It allows for the user to upload multiple images and remove them
  */
  const navigate = useNavigate();

  if (!client.authStore.isValid) {
    navigate('/signin');
  }

  const checkSubscription = async () => {
    const record = await client.collection('users').getOne(client.authStore.model.id, {});
    if (!record.createdSubscription) {
      navigate('/setup');
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

  const [loading, setLoading] = useState(false);

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
    setLoading(true);

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
    await createBook(data, Images);
  }

  async function createBook(data, images) {
    try {
      const record = await client.collection('book').create(data);
      const imagesRecord = await client.collection('book').update(record.id, images);
      console.log(record)
      // redirect to search page
      setLoading(false);
      navigate('/');
    } catch (err) {
      alert(err);
      setLoading(false);
    }
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
        <button className={`flex-1 w-full h-full px-4 pt-3 pb-2 text-xl font-bold text-center transition text-white border-b-2 inner-shadow-main backdrop-blur-md ${CreateBook ? 'border-b-white bg-black/20' : 'bg-black/50 border-b-white/20'}`} onClick={() => setCreateBook(true)}>Book</button>
        <button className={`flex-1 w-full h-full px-4 pt-3 pb-2 text-xl font-bold text-center transition text-white border-b-2 inner-shadow-main backdrop-blur-md ${CreateBook ? 'bg-black/50 border-b-white/20' : 'border-b-white bg-black/20'}`} onClick={() => setCreateBook(false)}>Collection</button>
      </div>
    }>
    <>
      { CreateBook ?
      <div className="flex flex-col gap-4 px-4">        
        <h2 className="pr-4 text-lg font-light text-white ">Book Title</h2>
        <input maxLength={100} type="text" className="input-text" value={bookName} onChange={(e) => setBookName(e.target.value)} />
        <h2 className="pr-4 text-lg font-light text-white ">Book Author <span className="italic text-gray-300">(optional)</span></h2>
        <input maxLength={100} className="input-text" type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
        <h2 className="pr-4 text-lg font-light text-white ">Book Publisher <span className="italic text-gray-300">(optional)</span></h2>
        <input maxLength={100} className="input-text" type="text" value={bookPublisher} onChange={(e) => setBookPublisher(e.target.value)} />
        <h2 className="pr-4 text-lg font-light text-white ">Date Published <span className="italic text-gray-300">(optional)</span></h2>
        <input className="input-text" type="date" value={datePublished} onChange={(e) => setDatePublished(e.target.value)} />
        <h2 className="pr-4 text-lg font-light text-white">Description <span className="italic text-gray-300">(optional)</span></h2>
        <textarea maxLength={5000} rows="18" type="text" className="input-text" onChange={(e) => setDescription(e.target.value)}/>
        <h2 className="pr-4 text-lg font-light text-white ">Book Borrower <span className="italic text-gray-300">(optional)</span></h2>
        <div className="px-2 py-2 rounded-lg shadow-inner bg-black/40 backdrop-blur-sm">
          <div className="relative">
            <input maxLength={128} className="w-full px-4 py-2 rounded-lg outline-none input-text" type="text" value={borrower} onChange={(e) => {setBorrower(e.target.value), getBorrowers(e.target.value), setBorrowerSelection(-2)}} />
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
          ))}
          </>
          : null}
        </div>
        
        <h2 className="pr-4 text-lg font-light text-white ">Main Images</h2>
        <div className="flex gap-2 px-2 py-2 text-white outline-none input-text">

            
            <div className="flex-1 max-h-fit">
                {spineImage ?
                    <button className="w-full px-4 py-2 mb-4 text-white bg-transparent border-2 rounded-lg shadow-inner inner-shadow-main border-white/20 backdrop-blur-sm backdrop-brightness-150" onClick={() => SpineImage.current.click()}>Set Spine Image</button>
                    :
                    <button className="w-full px-4 py-2 mb-4 text-white bg-transparent border-2 rounded-lg shadow-inner inner-shadow-main border-white/20 backdrop-blur-sm backdrop-brightness-150" onClick={() => SpineImage.current.click()}>Set Spine Image</button>
                }
                
                <input type="file" id="spineImage" className="hidden" ref={SpineImage} accept="image/*" onChange={(event) => {handleCompressedSpine(event.target.files[0]);}} />
                {spineImage ?
                    <img alt="Spine Image" className="max-w-full mx-auto my-auto rounded-md max-h-60" onClick={() => SpineImage.current.click()} src={SpinePreview} />
                    :
                    <img alt="No Spine Image" className="max-w-full mx-auto my-auto rounded-md opacity-20 max-h-60" onClick={() => SpineImage.current.click()} src={SpinePreviewImage} />
                }
            </div>
            <div className="flex-1 max-h-fit">
                {CoverImage ?
                    <button className="w-full px-4 py-2 mb-4 text-white border-2 rounded-lg shadow-inner inner-shadow-main bg-white/0 border-white/20 backdrop-blur-sm backdrop-brightness-150" onClick={() => CoverImage.current.click()}>Set Cover Image</button>
                    :
                    <button className="w-full px-4 py-2 mb-4 text-white border-2 rounded-lg shadow-inner inner-shadow-main bg-white/0 border-white/20 backdrop-blur-sm backdrop-brightness-150" onClick={() => CoverImage.current.click()}>Set Cover Image</button>
                }
                <input type="file" id="coverImage" className="hidden" ref={CoverImage} accept="image/*" onChange={(event) => {handleCompressedCover(event.target.files[0])}} />
                {coverImage ?
                    <img alt="Cover Image" onClick={() => CoverImage.current.click()} src={CoverPreview} className="max-w-full mx-auto my-auto rounded-md max-h-60" />
                    :
                    <img alt="No Cover Image" onClick={() => CoverImage.current.click()} className="max-w-full mx-auto my-auto rounded-md opacity-20 max-h-60" src={CoverPreviewImage} />
                }
            </div>
        </div>
        <h2 className="pr-4 text-lg font-light text-white">Other Images <span className="italic text-gray-300">(optional)</span></h2>
        <div className="flex flex-wrap gap-4 px-4 py-2 text-white outline-none input-text">
            <img alt="Add another image" className="h-32 pointer-events-auto image" src="../images/plus.svg" onClick={() => OtherImages.current.click()} />
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
            ))
            }

        </div>
        <div className="flex gap-4 pt-4">
            <a href="/" className="ml-auto secondary-button">Cancel</a>
            { loading ?
              <button disabled className="flex gap-2 mr-0 select-none primary-button"><span className="my-auto">Submitting...</span> <LoadingSpinner width={24} /></button> :
              <button onClick={() => {submit()} } className="mr-0 select-none primary-button">Submit</button>
            }
        </div>
      </div>
      :
      <CreateCollection />
    }     
    </>
    </Layout>
  )
};