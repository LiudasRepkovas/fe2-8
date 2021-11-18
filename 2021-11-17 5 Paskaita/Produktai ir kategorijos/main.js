import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const MONGO_CONNECTION_STRING = 'mongodb://127.0.0.1:27017';
const PORT = 3000;

const mongoClient = new MongoClient(MONGO_CONNECTION_STRING);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/categories', async (req, res) => {

    const connection = await mongoClient.connect();
    const array = await connection
        .db('products')
        .collection('categories')
        // perduodam filter objekta
        .find()
        .toArray()
    connection.close();
    res.send(array);
})


app.get('/products', async (req, res) => {

    const connection = await mongoClient.connect();
    const array = await connection
        .db('products')
        .collection('products')
        // perduodam filter objekta
        .aggregate(
            [
                {$lookup: {
                    from: 'categories',
                    localField: 'category_id',
                    foreignField: 'id',
                    as: 'category',
                }},
                {$set: 
                    {category: { $arrayElemAt: ["$category.title", 0] }}
                }
            ]
        )
        .toArray()
    connection.close();
    res.send(array);
})



app.get('/categoryvalue', async (req, res) => {

    const connection = await mongoClient.connect();
    const array = await connection
        .db('products')
        .collection('products')
        // perduodam filter objekta
        .aggregate(    [ 
            {$group: {
                _id: "$category_id",
                priceSum: { $sum: "$price"},
            }},
            {$lookup: {
                from: 'categories',
                localField: '_id',
                foreignField: 'id',
                as: 'category',
            }}
           ])
        .toArray()

    connection.close();
    
    const cleanArray = array.reduce(
        (acc, item) => {
            acc[item.category[0].title] = item.priceSum;
            return acc;
        }, {})

    res.send(cleanArray);
})


app.listen(PORT)