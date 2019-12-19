const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');

const app = express();

// DB Config
const db = require('./config/keys').mongoURI;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => newFunction()('MongoDB Connected Successfully'))
  .catch((err) => console.log(err));

// Passportn Middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Use these routes
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);

//  Serve static asset assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set Static Folder
  app.use(express.static('./client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Web App is live on port ${port}`));
function newFunction() {
  return console.log;
}
