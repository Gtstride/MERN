const express = require('express');
const mongoose = require('mongoose');

const app = express();

//DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hey! time to fly?'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Web App is live on port ${port}`));
