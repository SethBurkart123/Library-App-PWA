const global = {
  "pocketbaseUrl": "http://192.168.0.10:8090"
}

export function getImageUrl(bookId, image) {
  return `${global.pocketbaseUrl}/api/files/3mvsgrp33oefapt/${bookId}/${image}`
}
export function getThumbImageUrl(bookId, image) {
  return `${global.pocketbaseUrl}/api/files/3mvsgrp33oefapt/${bookId}/${image}?thumb=0x500`
}

export default global;