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

// import validator functionality
const {
  validateRegisterInput,
  validateLoginInput
} = require('../validator/validator');

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
  // check input data is valid or not
  const {
    isValid, errors
  } = validateRegisterInput(req.body);
  if (!isValid) res.status(400).json(errors);

  let { name, email, password } = req.body;

  // check email exist or not.
  User.findOne({ email })
    .then(user => {
      if (user) {
        errors.email = 'Email already exist';
        res.status(409).json(errors)
      } else {
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
  // check input data is valid or not
  const {
    isValid,
    errors
  } = validateLoginInput(req.body);
  if (!isValid) res.status(400).json(errors);

  let { email, password } = req.body;

  // Find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = 'User account not found';
      res.status(404).json(errors);
    } else {
      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) { // user & password matched
          // Create JWT Payload
          const payload = { id: user.id, name: user.name, email: user.email };

          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 86400 },
            (err, token) => {
              if (err) console.error(err)
              res.status(200).json({
                success: true,
                token: 'Bearer ' + token
              })
            });
        } else {
          errors.password = 'Password is incorrect';
          res.status(400).json(errors);
        }
      }).catch(err => console.log(err));
    }
  }).catch(err => console.error(err));
}

module.exports = { registerController, loginController }