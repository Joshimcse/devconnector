/**
 * User.js
 *
 * @module      :: Model
 * @description :: Represent data model for the Users
 * @author		  :: Joshim Uddin
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  Date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('users', UserSchema);