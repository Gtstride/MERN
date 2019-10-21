import express from 'express';

const app = express();

app.get('/', (req, res) => res.send('Hey! there, how dddo you do'));

const port = process.env.PORT || 5000;

app.listen(port, () => )
