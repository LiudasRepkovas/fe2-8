import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import axios from 'axios';
import fetch from 'node-fetch';

dotenv.config();

const { PORT, MONGO_CONNECTION_STRING } = process.env;

console.log(MONGO_CONNECTION_STRING)

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(MONGO_CONNECTION_STRING);

app.get('/', async (req, res) => {


    // kreiptis i random user api

    // const randomUserApiResult = await axios.get('https://randomuser.me/api/');

    // console.log(randomUserApiResult.status);
    // console.log(randomUserApiResult.statusText);
    // console.log(randomUserApiResult.headers);

    // console.log(randomUserApiResult.data);

    // const {title, first, last} = randomUserApiResult.data.results[0].name;


    const fetchResponse = await fetch('https://randomuser.me/api/');
    const responseJSON = await fetchResponse.json();


    const {title, first, last} = responseJSON.results[0].name;

    let name = `${title} ${first} ${last}`;

    // ideti gauto random userio varda i mongo collection

    const connection = await mongoClient.connect();
    const insertResult = await connection
        .db('randomUserNames')
        .collection('names')
        .insertOne({name});

    // grazinti visus jau esancius vardus
    const namesArray = await connection
        .db('randomUserNames')
        .collection('names')
        .find()
        .toArray();

    connection.close();
    res.send(namesArray);
});

app.listen(PORT, ()=> {
    console.log('App listening on port: ', PORT);
})