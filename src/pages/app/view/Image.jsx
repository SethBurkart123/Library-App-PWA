import { XCircleIcon } from "@heroicons/react/20/solid";
import React, { useEffect } from "react";
import { getImageUrl } from "../../../globalVars";

export function Image({
  bookId,
  image,
  setDisplayImage,
  displayImage
}) {
  return (
  <>
  {displayImage ?
  <div className="absolute top-0 left-0 flex items-center justify-center w-screen h-screen m-0 backdrop-blur-sm bg-black/80 z-60">
    <div className="relative">
      <XCircleIcon onClick={() => {setDisplayImage(false)}} className="absolute z-40 h-12 text-black bg-white rounded-full cursor-pointer top-4 right-4" />
      <img className="max-h-screen pointer-events-none max-w-screen" src={getImageUrl(bookId, image)} />
    </div>
  </div> : <></>}
  </>
  );
}
