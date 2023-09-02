/*
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  export const global = {
    "pocketbaseDomain": 'https://api.libraryapp.co',
    "homepageDomain": 'http://localhost:3000',
    "appDomain": 'http://localhost:5173'
  }
} else {
  export const global = {
    "pocketbaseDomain": 'https://api.libraryapp.co',
    "homepageDomain": 'https://libraryapp.co',
    "appDomain": 'https://app.libraryapp.co'
  }
}
*/

export const global = {
  "pocketbaseDomain": 'https://api.libraryapp.co',
  "homepageDomain": 'https://libraryapp.co',
  "appDomain": 'https://app.libraryapp.co'
};

export function getImageUrl(bookId, image) {
  return `${global.pocketbaseDomain}/api/files/3mvsgrp33oefapt/${bookId}/${image}`;
}
export function getThumbImageUrl(bookId, image) {
  return `${global.pocketbaseDomain}/api/files/3mvsgrp33oefapt/${bookId}/${image}?thumb=0x500`;
}

export default global;