/**
 * userController.js
 *
 * @module      :: Controller
 * @description :: defination of users routes action
 * @author      :: Joshim Uddin
 */

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load Keys
const keys = require('../config/keys');

// Load User Model
const User = require('../models/User');

/**
* @controller Register
* @desc       register a users to the database...
* @return     
*/
const registerController = (req, res) => {
  let { name, email, password, password2 } = req.body;

  // check email exist or not.
  User.findOne({ email })
    .then(user => {
      if (user) res.status(409).json({ Error: 'Email already exist' })
      else {
        let avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });
        const newUser = new User({ name, email, password, avatar });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save()
              .then(user => res.status(201).json(user))
              .catch(err => console.log(err));
          })
        })
      }
    }).catch(err => console.error(err));
}

/**
* @controller Login
* @desc       
* @return     
*/
const loginController = (req, res) => {
  let { email, password } = req.body;

  // Find user by email
  User.findOne({ email }).then(user => {
    if (!user) res.status(404).json({ Error: 'User not found' });
    else {
      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) { // user & password matched
          // Create JWT Payload
          const payload = { id: user.id, name: user.name, avatar: user.avatar };

          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKe,
            { expiresIn: 3600 },
            (err, token) => {
              res.status(200).json({
                success: true,
                token: 'Bearer ' + token
              })
            });
        } else {
          res.status(400).json({ Error: 'Password incorrect' });
        }
      }).catch(err => console.log(err));
    }
  }).catch(err => console.error(err));
}

module.exports = { registerController, loginController }