import PocketBase from 'pocketbase';

const client = new PocketBase('http://127.0.0.1:8090');

const data = {
    "bookName": "Doe and his cats",
    "authorName": "John Doe",
    "bookPublisher": "meow comics",
    "datePublished": "2020-01-01",
    "description": "A book about cats",
    "spineImage": "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x2.jpg",
    "coverImage": "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x2.jpg",
    "otherImages": [
        "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x2.jpg"
    ]
};

const record = await client.records.create('books', data);