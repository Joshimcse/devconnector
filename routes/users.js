/**
 * users.js
 * 
 * @module      :: Routes
 * @description :: Users routes and action
 * @author      :: Joshim Uddin
 */

const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { registerController } = require('../controller/users');

const keys = require('../config/keys');

// Load User Model
const User = require('../models/User');

/**
 * @route  POST api/users/register
 * @desc   Register a user to the database...
 * @access Public
 */
router.post('/register', registerController);

/** 
 * @route  POST api/users/login
 * @desc   check provided info, If all information is valid then generated a token.
 * @access Public
 */
router.post('/login', (req, res) => {
  let { email, password } = req.body;
  // Find User by email
  User.findOne({ email })
    .then(user => {
      // Check user is exists or not
      if (!user) {
        res.status(404).json({ Error: 'User not found' });
      }

      // Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // User Matched

            //Create JWT Payload
            const payload = { id: user.id, name: user.name, avatar: user.avatar };

            // Sign Token
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                res.json({
                  success: true,
                  token: 'Bearer ' + token
                })
              })
          } else {
            res.status(400).json({ Error: 'Password incorrect' });
          }
        });
    }).catch(err => console.error(err));
})

module.exports = router;