/**
 * users.js
 * 
 * @module      :: Routes
 * @description :: Users routes and action
 * @author      :: Joshim Uddin
 */

const router = require('express').Router();

// import controller
const { registerController, loginController } = require('../controller/users');

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

module.exports = router;