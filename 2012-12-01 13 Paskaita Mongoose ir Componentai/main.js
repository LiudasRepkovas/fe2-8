import express, { response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {PORT, MONGO_CONNECTION_STRING} from './config.js';
import { PetModel } from './models/pets.model.js';
import Joi from 'joi';
import { UserModel } from './models/users.model.js';

const app = express();
app.use(express.json());
app.use(cors());


app.get('/users', async (req, res) => {
    const allUsers = await UserModel.find({});
    res.send(allUsers);
})

app.post('/users', async (req, res) => {
    const body = req.body;

    const bodySchema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    })

    try {
        await bodySchema.validateAsync(body);
    } catch (e) {
        console.log(e);
        res.status(400).send({
            success:false, error: e.details[0].message
        })
    }

    try {
        const newUser = new UserModel(body);
        const insertResult = await newUser.save();
        res.send({success: true, result: insertResult});
    } catch (e) {
        console.log(e.message);
        res.status(400).send({
            success:false, error: e.message
        })
    }
})

app.get('/pets', async (req, res) => {
    const allPets = await PetModel.find({}).populate('user');
    res.send(allPets);
})

app.post('/pets', async (req, res) => {
    const body = req.body;

    const bodySchema = Joi.object({
        name: Joi.string().required(),
        type: Joi.string().required(),
        age: Joi.number().required(),
        user: Joi.string().required(),
    });

    try {
        await bodySchema.validateAsync(body);
    } catch (e) {
        console.log(e);
        res.status(400).send({
            success:false, error: e.details[0].message
        })
    }

    try {
        const newPet = new PetModel(body);
        const insertResult = await newPet.save();
        res.send({success: true, result: insertResult});
    } catch (e) {
        console.log(e);

    }
})

mongoose.connect(MONGO_CONNECTION_STRING).then(()=>{
    console.log('Mongoose connected!');
});

app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`)
})