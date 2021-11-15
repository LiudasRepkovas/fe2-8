import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const MONGO_CONNECTION_STRING = 'mongodb://127.0.0.1:27017';

const mongoClient = new MongoClient(MONGO_CONNECTION_STRING);

const app = express()
const port = 3000

app.use(express.json());
app.use(cors());

app.get('/users', async (req, res) => {
    const connection = await mongoClient.connect();
    const data = await connection.db('TestineDuomenuBaze').collection('Users').find().toArray();
    await connection.close();
    res.send(data)
})

app.get('/users/:id', async (req, res) => {
    const userId = Number(req.params.id);
    const connection = await mongoClient.connect();
    const data = await connection
        .db('TestineDuomenuBaze')
        .collection('Users')
        .findOne({
            id: userId
        })
    await connection.close();
    res.send(data)
});

app.post('/users', async (req, res) => {

    // gauti duomenis
    const {
        name, surname, email, id, role
    } = req.body;

    // iterpti duomenis i duombaze
    const connection = await mongoClient.connect();
    const data = await connection
        .db('TestineDuomenuBaze')
        .collection('Users')
        .insertOne({
            name, surname, email, id, role
        })
    await connection.close();

    res.send(data);
});

app.put('/users/:id', async (req, res) => {
    const userId = Number(req.params.id);

    const fieldsToUpdate = {};
    if(req.body.name){
        fieldsToUpdate['name'] = req.body.name;
    }
    if(req.body.surname){
        fieldsToUpdate['surname'] = req.body.surname;
    }
    if(req.body.email){
        fieldsToUpdate['email'] = req.body.email;
    }
    if(req.body.id){
        fieldsToUpdate['id'] = req.body.id;
    }
    if(req.body.role){
        fieldsToUpdate['role'] = req.body.role;
    }

    const connection = await mongoClient.connect();
    const data = await connection
        .db('TestineDuomenuBaze')
        .collection('Users')
        .updateOne(
            { id: userId},
            {
                $set: fieldsToUpdate
            }
        )
    await connection.close();

    res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})