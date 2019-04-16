/**
 * users.js
 * 
 * @module      :: Routes
 * @description :: Users routes and action
 * @author      :: Joshim Uddin
 */

const router = require('express').Router();
const passport = require('passport');

// import controller
const {
  registerController,
  loginController,
  currentController
} = require('../controller/users');

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
router.post('/login', loginController);

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;