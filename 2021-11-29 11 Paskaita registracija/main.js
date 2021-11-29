import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import joi from 'joi';
import bcrypt from 'bcrypt';
import {PORT, MONGO_CONNECTION_STRING, TOKEN_SECRET} from './config.js';
import jwt from 'jsonwebtoken';
import { auth } from './middlewares.js';
import { ObjectID } from 'bson';

const client = new MongoClient(MONGO_CONNECTION_STRING);

const app = express();
app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) => {
    const body = req.body;
    
    // kuriam body validacijos schemą
    const bodySchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(8).required(),
    });

    // validuojam requesta
    try {
        await bodySchema.validateAsync(body);
    } catch (e) {
        console.log(e);
        res.status(400).send({success: false, error: e.details[0].message});
        return;
    }

    // kuriam connectiona
    let connection;
    try {
        connection = await client.connect();
    } catch {
        res.status(500).send({success: false, error: 'Internal server error'});
    }

    // tikrinam ar emailas neuzimtas
    try {
        const user = await connection.db('authExample')
        .collection('users')
        .findOne({
            email: body.email
        });
        if(user){
            res.status(400).send({
                success: false,
                error: "Email taken",
            })
            return;
        }
    } catch (e) {
        res.status(500).send({success: false, error: 'Internal server error'});
        return;
    }

    // hashinam passworda
    const passwordHash = bcrypt.hashSync(body.password, 10);

    // kuriam useri
    try {
        await connection.db('authExample')
            .collection('users')
            .insertOne({
                email: body.email,
                password: passwordHash,
            });
        await connection.close();
    } catch (e) {
        console.log(e);
        res.status(500).send({success: false, error: 'Could not create user'});
        return;
    }

    res.send({sucess: true})
});

app.post('/login', async (req, res) => {
    const body = req.body;

    // tikrinam ar useris egzistuoja
    try {
        const connection = await client.connect();
        const user = await connection.db('authExample')
        .collection('users')
        .findOne({email: body.email});

        if(!user) {
            res.send({success: false, error: 'User not found'})
            return;
        }

        // tikrinam ar duomenu bazej esantis passwordo hashas sutampa su perduotu į body
        const doPasswordsMatch = bcrypt.compareSync(body.password, user.password);


        // jei passwordai sutampa sugeneruojam JWT tokeną ir issiunciam useriui
        if(doPasswordsMatch){
            const token = jwt.sign({userId: user._id}, TOKEN_SECRET, {
                expiresIn: 1200
            });

            res.send({success: true, token});
        } else {
            res.send({success: false, error: 'Incorrect password'});
        }

    } catch (e) {
        console.log(e);
        res.status(500).send({success: false, error: 'Internal server error'});
        return;
    }
})


// pridedam auth middleware'ą
app.get('/userInfo', auth, async (req, res) => {

    // req.userId laukas sukuriamas auth middleware

    try {
        const connection = await client.connect();
        const user = await connection.db('authExample')
        .collection('users')
        .findOne({_id: ObjectID(req.userId)});

        if(!user) {
            res.send({success: false, error: 'User not found'})
            return;
        }

        res.send(user);

    } catch (e) {

        console.log(e);
        res.status(500).send({success: false, error: 'Internal server error'});
        return;
    }

});

app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`)
})