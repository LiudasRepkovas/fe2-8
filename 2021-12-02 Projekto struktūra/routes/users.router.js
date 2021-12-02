import { Router } from 'express';
import Joi from 'joi';
import { UserModel } from '../models/users.model.js';
import { getAllUsers, createUser } from '../components/user/user.bussiness.js';

const router = new Router();


router.get('/', async (req, res) => {
    const allUsers = await getAllUsers();
    res.send(allUsers);
})

router.post('/', async (req, res, next) => {
    const body = req.body;

    const bodySchema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
    })

    try {
        await bodySchema.validateAsync(body);
    } catch (e) {
        const error = new Error(e.details[0].message)
        error.code = 400;
        next(error);
        return;
    }

    try {
        const insertResult = await createUser(body);
        res.send({success: true, result: insertResult});
    } catch (e) {
        const error = new Error(e.message);
        error.code = 400;
        next(error);
        return;
    }
})

export default router;
