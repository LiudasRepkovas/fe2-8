import express, { response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {PORT, MONGO_CONNECTION_STRING} from './config.js';
import { PetModel } from './models/pets.model.js';
import Joi from 'joi';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/pets', async (req, res) => {
    const allPets = await PetModel.find({});
    res.send(allPets);
})

app.post('/pets', async (req, res) => {
    const body = req.body;

    const bodySchema = Joi.object({
        name: Joi.string().required(),
        type: Joi.string().required(),
        age: Joi.number().required()
    })

    try {
        await bodySchema.validateAsync(body);

        const newPet = new PetModel(body);
        const insertResult = await newPet.save();
        res.send({success: true, result: insertResult});

    } catch (e) {
        console.log(e);
        res.status(400).send({
            success:false, error: e.details[0].message
        })
    }
})

mongoose.connect(MONGO_CONNECTION_STRING).then(()=>{
    console.log('Mongoose connected!');
});

app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`)
})