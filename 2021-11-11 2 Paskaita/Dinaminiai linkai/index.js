import express from 'express';
import cors from 'cors';

const app = express()
const port = 3000

// ijungiame json ir cors middleware'us
app.use(express.json());
app.use(cors());


// gyvunu masyvas
const animals = [
  {
    name: "Tom",
    type: "cat",
  },
  {
    name: "Tim",
    type: "cat",
  },
  {
    name: "Mike",
    type: "dog",
  },
  {
    name: "Jerry",
    type: "mouse",
  }
]

// route, kuris grazina visus gyvunus
app.get('/animals', (req, res) => {
  // siunciame visu gyvunu masyva kaip response
  res.send(animals)
})

// route, kuris grazina tik tam tikro tipo gyvunus
app.get('/animals/:type', (req, res) => {

  // gauname type is route parametru objeko
  const type = req.params.type;

  // filtruojame gyvunu masyva, palikdami tik gauto tipo gyvunus
  const animalsOfType = animals.filter(animal => animal.type === type);

  // siunciame filtruota masyva kaip response
  res.send(animalsOfType)
})

// paleidziame express serveri
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})