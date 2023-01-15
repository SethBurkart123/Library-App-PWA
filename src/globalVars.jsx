const global = {
  "pocketbaseUrl": "https://api.libraryapp.co"
}

export function getImageUrl(bookId, image) {
  return `${global.pocketbaseUrl}/api/files/3mvsgrp33oefapt/${bookId}/${image}`
}
export function getThumbImageUrl(bookId, image) {
  return `${global.pocketbaseUrl}/api/files/3mvsgrp33oefapt/${bookId}/${image}?thumb=0x500`
}

export default global;