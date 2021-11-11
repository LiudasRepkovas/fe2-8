import express, { request } from 'express';
import cors from 'cors';
import { data } from './data.js';

const app = express()
const port = 3000

// ijungiame json ir cors middleware'us
app.use(express.json());
app.use(cors());

// Sukurkite bendrinį GET route, kuris paduos visus duomenis.
app.get('/users', (request, response ) => {
  response.send(data);
})

//Sukurkite dinaminį GET route, kur URL turės 
//automobilio markę ir pagal ją prafiltruos, 
//ir grąžins tik tuos žmones, kurie turi šį automobilį.

app.get('/users/car/:brand', (request, response) => {
  // issaugom brand i kintamaji
  const brand = request.params.brand;

  // isrenkame tik userius su tam tikro brando automobiliu
  const usersThatOwnACarOfBrand = data.filter( user => {
    return user.car.toLowerCase() === brand.toLocaleLowerCase();
  })

  response.send(usersThatOwnACarOfBrand);
})

// Sukurkite dinaminį GET route, kuris 
// priims vartotojo id ir pagal jį grąžins
// atitinkamą vartotojo objektą.
// Hint: url parametrai visada stringai, 
// o čia id - skaičius, tad reikės konvertuoti.

app.get('/users/findById/:id', (request, response) => {
  // saugom id i kintamaji
  const id = request.params.id;

  // ieskom userio pagal id
  const user = data.find(item => {
    // galima ir taip: item.id === id
    return item.id === Number(id);
  })

  // grazinam response
  response.send(user);
})


// Sukurkite GET route, kuris grąžins visus el. 
// paštus (grąžinamas formatas: ["anb@abc.com", "abc@abc.com", "abc@acb.com]).

app.get('/users/emails', (request, response) => {
  const emails = data.map(item => item.email);
  response.send(emails)
})

// Sukurkite GET route, kuris grazins visu tam tikros lyties
// zmonius vardus ir pavardes: ['Vardas Pavarde', 'Vardas Pavarde']
app.get('/users/findByGender/:gender', (request, response) => {
  // issaugome gender kintamajame
  const gender = request.params.gender;

  // filtruojam userius pagal lyti
  const usersOfGender = data.filter(item => item.gender.toLowerCase() === gender.toLowerCase());

  // mapinam user objektus i vardo ir pavardes stringus
  const nameStrings = usersOfGender.map(item => {
    return `${item.first_name} ${item.last_name}`;
  })

  // siunciam atsakyma
  response.send(nameStrings);
})

// pridedam useri i masyva

app.post('/users', (request, response) => {
  // naudojam destrukturizacija, kad gautume tik reikalingus laukus
  const {
    first_name, 
    last_name, 
    id, 
    email, 
    gender, 
    car
  } = request.body;

  // sukuriam nauja user objekta
  const newUser = {
    first_name, 
    last_name, 
    id, 
    email, 
    gender, 
    car
  }

  // ikeliam useri i masyva
  data.push(newUser);

  // siunciam response
  response.send({
    success: true,
    user: newUser
  })
})

// paleidziame express serveri
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})