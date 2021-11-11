import express from 'express';
import cors from 'cors';

const app = express()
const port = 3000

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.post('/vyresni', (req, res) => {

    const body = req.body;
    const age = body.age;

    const vyresni = people.filter( (person) => {
        return person.age > age;
    } )

    res.send(vyresni);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})