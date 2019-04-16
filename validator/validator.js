/**
 * validator.js
 *
 * @module      :: 
 * @description :: 
 * @author      :: Joshim Uddin
 */

const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = {
  validateRegisterInput: (data) => {
    const errors = {}

    let { name, email, password, password2 } = data;

    name = !isEmpty(name) ? name : '';
    email = !isEmpty(email) ? email : '';
    password = !isEmpty(password) ? password : '';
    password2 = !isEmpty(password2) ? password2 : '';

    if (!validator.isLength(name, { min: 3, max: 30 }))
      errors.name = 'Name must be between 3 and 30 characters.';

    if (validator.isEmpty(name))
      errors.name = 'Name must be required.';

    if (!validator.isEmail(email))
      errors.email = 'Email is invalid.';

    if (validator.isEmpty(email))
      errors.email = 'Email must be required.';

    if (!validator.isLength(password, { min: 6, max: 36 }))
      errors.password = 'Password must be between 6 and 36 characters.';

    if (validator.isEmpty(password))
      errors.password = 'Password must be required.';

    if (!validator.equals(password, password2))
      errors.confirmPassword = 'Those passwords didn\'t match.';

    if (validator.isEmpty(password2))
      errors.confirmPassword = 'Confirm Password must be required.';

    return ({
      isValid: isEmpty(errors),
      errors
    })
  }
}