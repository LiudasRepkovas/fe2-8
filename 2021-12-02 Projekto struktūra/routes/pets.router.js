
import Joi from 'joi';
import { Router } from 'express';
import { createPet, getAllPets } from '../components/pets/pets.bussiness.js';

const router = new Router();

router.get('/', async (req, res) => {
    const allPets = await getAllPets();
    res.send(allPets);
})

router.post('/', async (req, res) => {
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
        const error = new Error(e.details[0].message)
        error.code = 400;
        next(error);
        return;
    }

    try {
        const insertResult = await createPet(body);
        res.send({success: true, result: insertResult});
    } catch (e) {
        const error = new Error(e.message);
        error.code = 500;
        next(error);
        return;
    }
})

export default router;