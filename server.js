/**
 * server.js
 * 
 * @description :: Main App file && Entry point
 * @author      :: Joshim Uddin
 */

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');

// set up express app
const app = express();

// Middleware
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

// Passport middleware
app.use(passport.initialize());
// Passport config
require('./config/passport')(passport);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json())

// initialize routes
app.use('/api/users', require('./routes/users'));

// Error handling Middleware

// listen for request
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Magic happens on port ${port}`);

  // Load DB
  const db = require('./config/keys').mongoURI;

  //MongoDB configuaration
  mongoose.connect(db, { useNewUrlParser: true }, (err, res) => {
    if (err) console.error(err);
    else console.log('Connected to Database');
  });
});


// Testing Routes
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Routes work successfully' });
})
