/**
 * users.js
 * 
 * @module      :: Routes
 * @description :: Users routes and action
 * @author      :: Joshim Uddin
 */

const router = require('express').Router();

// Load User Model
const User = require('../models/User');

/**
 * @route  GET api/users
 * @desc   That's route for retrive all users.
 * @access Public
 */
router.get('/', (req, res) => {
  User.find({})
    .then(users => {
      if (!users) return res.json({ msg: 'Users Database is Empty' });
      else return res.json(users)
    });
});

module.exports = router;