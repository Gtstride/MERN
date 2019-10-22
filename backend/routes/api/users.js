const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');


// Import User Model
const User = require('../../models/User');

/**
 * @route GET api/users/test
 * @desc Tests users route
 * @access Public
 */ 
router.get('/test', (req, res) => 
  res.json({msg: "Users Works fine"}));

  /**
 * @route GET api/users/register
 * @desc Allow Users to register
 * @access Public
 */ 

 router.post('/register', (req, res) => {
  User.findOne({
    email: req.body.email
  })
  .then(user => {
    if(user) {
      return res.status(400).json({ 
        email: "Email already Exists"
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size of gravatar
        r: "pg", // Rating 
        d: "mm" // Default
      });
      const newUser = new User({ 
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar 
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if(err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        })
      })
    }
  })
 });


  /**
 * @route GET api/users/login
 * @desc Login User / Returning JWT Token
 * @access Public
 */ 

 router.post('/login', (req, res) => {
   const email = req.body.email;
   const password = req.body.password;

  //  Find user email
  User.findOne({ email })
    .then(user => {
      // check for user
      if(!user) {
        return res.status(404).json({
          email: "Email not Found"
        });
      }

      // Check Password
      bcrypt.compare(password, user.password)
      .then(isMatch => {
        if(isMatch) {
            // Users Creditians matched
            const payload = { id: user.id , name: user.name, avatar: user.avatar } //Create JWT Payload

            // Sigin Token
            jwt.sign(payload, keys.secretorKey, { expiresIn: 3600 }, (err, token) => {
              res.json({
                "message": "Successfully login",
                "token": "Bearer " + token
              }); 
            });
        } else {
          return res.status(400).json({ password: "Incorrect password" });
        }
      });
    });
 });


module.exports = router;