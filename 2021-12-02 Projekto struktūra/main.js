import express, { response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {PORT, MONGO_CONNECTION_STRING} from './config.js';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import errorHandlerMiddleware from './middlewares/errorHandler.middleware.js';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/users', usersRouter);
app.use('/pets', petsRouter);
app.use('*', (req, res) => {
    res.status(404).send({success: false, error: "Not found"});
})
app.use(errorHandlerMiddleware);

mongoose.connect(MONGO_CONNECTION_STRING).then(()=>{
    console.log('Mongoose connected!');
});

app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`)
})