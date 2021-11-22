import dotenv from 'dotenv';
import {PORT, ENV, MONGO_CONNECTION_STRING} from 'config';

dotenv.config();

console.log(ENV);
console.log(PORT);
console.log(MONGO_CONNECTION_STRING);