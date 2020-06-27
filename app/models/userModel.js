const mongoose = require('./../config/model');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Missing name field']
  },
  username: {
    type: String,
    required: [true, 'Missing username field'],
    unique: [true, 'Username has already been taken']
  },
  email: {
    type: String,
    required: [true, 'Missing email field'],
    unique: [true, 'Email has been registered'],
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      'Email address is not valid'
    ]
  },
  password: {
    type: String,
    required: [true, 'Missing password field'],
    minlength: [8, 'Password needs to be at least 8 characters long'],
    select: false
  }
});

module.exports = mongoose.model('User', userSchema, 'users');