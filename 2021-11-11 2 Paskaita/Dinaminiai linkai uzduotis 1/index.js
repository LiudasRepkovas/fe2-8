import express from 'express';
import cors from 'cors';

const app = express()
const port = 3000

// ijungiame json ir cors middleware'us
app.use(express.json());
app.use(cors());

const cars = {
  bmw: ["i3", "i8", "1 series", "3 series", "5 series"],
  mb: ["A class", "C class", "E class", "S class"],
  vw: ["Golf", "Arteon", "UP"]
}

app.post('/cars/:brand', (request, response) => {
  // issaugome brand kintamajame
  const brand = request.params.brand;

  // gauti automobiliu modeliu sarasa
  const models = cars[brand];

  // grazinti modeliu sarasa kaip response
  response.send(models);
})

// paleidziame express serveri
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})