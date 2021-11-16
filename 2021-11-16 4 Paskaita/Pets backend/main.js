import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const MONGO_CONNECTION_STRING = 'mongodb://127.0.0.1:27017';
const PORT = 3000;

const mongoClient = new MongoClient(MONGO_CONNECTION_STRING);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/pets', async (req, res) => {

    let ageSort = 1;
    let filter = {};
    
    // jei gaunam age sort query parametra - keiciam ageSort kintamojo reikmse
    if(req.query.ageSort) {
        ageSort = req.query.ageSort === 'asc' ? 1 : -1;
    }

    // jei gauna tipo filtrus - konstruojam filters objekta
    if(req.query.typeFilters){
        //paverciam string i array 'dog,cat,bunny' => ['dog', 'cat', 'bunny']
        const filtersArray = req.query.typeFilters.split(',')
        filter.type = { $in: filtersArray };
        /* filter objektas atrodo mazdaug taip
            {
                "type": { "$in": ['dog', 'cat']}
            }
        
        */
    }

    const connection = await mongoClient.connect();
    const animalsArray = await connection
        .db('pets-project')
        .collection('pets')
        // perduodam filter objekta
        .find(filter)
        // nustatom sort
        .sort({age: ageSort})
        .toArray()
    connection.close();
    res.send(animalsArray);
})

app.post('/pets', async (req, res) => {
    const petToInsert = {};

    // jei kazkurio is privalomu lauku nera - siunciam atgal errora
    if(!req.body.name || !req.body.age || !req.body.type){
        res.status(400).send({error: "Please speficy all required fields"});
    }

    // verciam duomenis i lowercase, nes poto taip patogiau ieskot.
    if(req.body.name) {
        petToInsert['name'] = req.body.name.toLowerCase();
    }
    if(req.body.age) {
        petToInsert['age'] = Number(req.body.age)
    }
    if(req.body.type) {
        petToInsert['type'] = req.body.type.toLowerCase();
    }

    const connection = await mongoClient.connect();
    const inserted = await connection
        .db('pets-project')
        .collection('pets')
        .insertOne(petToInsert);
    connection.close();

    res.send(inserted);
})


app.listen(PORT)