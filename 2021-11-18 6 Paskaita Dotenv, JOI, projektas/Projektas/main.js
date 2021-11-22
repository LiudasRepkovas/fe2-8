import dotenv from 'dotenv';
import express, { Router } from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import joi from 'joi';
import { ObjectID } from 'bson';

dotenv.config();

const { PORT, MONGO_CONNECTION_STRING } = process.env;

const app = express();
app.use(cors());
app.use(express.json());

const mongoClient = new MongoClient(MONGO_CONNECTION_STRING);

app.get('/users', async (req, res)=>{
    const connection = await mongoClient.connect();
    const users = await connection
        .db('uzrasuKnygute')
        .collection('users')
        .find({})
        .toArray();
    connection.close();
    res.send(users);
})

app.post('/users', async (req, res) => {
    const body = req.body;

    const bodySchema = joi.object({
        firstName: joi.string()
            .max(50)
            .pattern(/\s/, {invert: true})
            .required()
            .messages({'string.pattern.invert.base' : "firstName should not contain spaces"}),
        lastName: joi.string()
            .max(50)
            .pattern(/\s/, {invert: true})
            .required()
            .messages({'string.pattern.invert.base' : "lastName should not contain spaces"}),
        email: joi.string().email().required(),
    })

    const validationResult = bodySchema.validate(body);

    if(validationResult.error) {
        const message = validationResult.error.details[0].message;
        res.status(400).send({
            success: false,
            error: message
        })
    } else {
        const connection = await mongoClient.connect();
        const insertResult = await connection
            .db('uzrasuKnygute')
            .collection('users')
            .insertOne({
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email
            })
        connection.close();
        res.send({
            success: true,
            result: insertResult
        })
    }
})



app.post('/notes', async (req, res) => {
    const body = req.body;

    const bodySchema = joi.object({
        title: joi.string()
            .max(50)
            .required(),
        text: joi.string()
            .max(1000)
            .required(),
        userId: joi.string().required(),
    })

    // ieskom ar toks useris egzistuoja.
    const connection = await mongoClient.connect();
    const user = await connection
        .db('uzrasuKnygute')
        .collection('users')
        .findOne({
            _id: ObjectID(body.userId),
        })
    connection.close();

    const validationResult = bodySchema.validate(body);

    if(!user) {
        res.status(400).send({
            success: false,
            error: 'User does not exist'
        })
    }

    if(validationResult.error) {
        const message = validationResult.error.details[0].message;
        res.status(400).send({
            success: false,
            error: message
        })
    } else {
        const connection = await mongoClient.connect();
        const insertResult = await connection
            .db('uzrasuKnygute')
            .collection('notes')
            .insertOne({
                title: body.title,
                text: body.text,
                userId: ObjectID(body.userId),
                done: false,
                createdAt: Number(new Date()),
            })
        connection.close();
        res.send({
            success: true,
            result: insertResult
        })
    }
})

app.get('/users/:userId/notes', async (req, res) => {
    
    const userId = req.params.userId;
    const date = req.query.date;


    const findObject = {
        userId: ObjectID(userId)
    };

    if(date) {
        const dateFromString = `${date}T00:00:01`;
        const dateFrom = new Date(dateFromString);
        const timestampFrom = Number(dateFrom);
        
        const dateToString = `${date}T23:59:59`;
        const dateTo = new Date(dateToString);
        const timestampTo = Number(dateTo);

        findObject.createdAt = {
            $gte: timestampFrom,
            $lte: timestampTo
        }
    }

    const connection = await mongoClient.connect();
    const notes = await connection
        .db('uzrasuKnygute')
        .collection('notes')
        .find(findObject)
        .project({title: 1, userId: 1, createdAt: 1, done: 1, _id: 0})
        .toArray();
    connection.close();

    res.send(notes);
});

app.get('/users/:userId/notes/:noteId', async (req, res) => {

    const userId = req.params.userId;
    const noteId = req.params.noteId;

    const connection = await mongoClient.connect();
    const notes = await connection
        .db('uzrasuKnygute')
        .collection('notes')
        .aggregate([
            { $match: {
                userId: ObjectID(userId),
                _id: ObjectID(noteId),
            }},
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $project: {
                user: { $first: "$user" },
                title: 1,
                text: 1,
                done: 1,
                createdAt: 1,
            }}
        ])
        .toArray();
    connection.close();
    res.send(notes);
});

app.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;

    const connection = await mongoClient.connect();
    const user = await connection
        .db('uzrasuKnygute')
        .collection('users')
        .aggregate([
            { $match: {
                _id: ObjectID(userId),
            }},
            {
                $lookup: {
                    from: 'notes',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'notes',
                },
            },
            { $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
                noteCount: { $size: "$notes" },
            }}
        ])
        .toArray();
    connection.close();
    res.send(user[0]);
})

app.put('/users/:userId/notes/:noteId/toggle', async (req, res) => {
    const userId = req.params.userId;
    const noteId = req.params.noteId;

    const connection = await mongoClient.connect();
    const note = await connection
        .db('uzrasuKnygute')
        .collection('notes')
        .findOne({
            _id: ObjectID(noteId),
           userId: ObjectID(userId)
        })
    
        const newDoneStatus = note.done === true ? false : true;

        await connection
        .db('uzrasuKnygute')
        .collection('notes')
        .updateOne({
           _id: ObjectID(noteId),
           userId: ObjectID(userId) 
        }, {
            $set: {
                done: newDoneStatus,
            }
        })

    res.send({
        success: true,
    })
});



app.listen(PORT, () => {
    console.log('Server listening on port: ', PORT)
});