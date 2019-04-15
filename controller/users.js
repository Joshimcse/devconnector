/**
 * userController.js
 *
 * @module      :: Controller
 * @description :: defination of users routes action
 * @author      :: Joshim Uddin
 */

const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/User');

/**
* @controller  Register
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

module.exports = { registerController }