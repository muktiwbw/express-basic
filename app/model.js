const env = require('./config/env');
const mongoose = require('mongoose');

mongoose.connect(env.dbUri, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true
}).then(() => console.log('Database connection is established...'));

/**
 * SCHEMA
 * Create your table schemas here...
 */

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name!'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price!']
  }
});

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
    minlength: [8, 'Password needs to be at least 8 characters long']
  }
});

/**
 * MODEL
 * Create and exports model based on schemas...
 */

exports.Tour = mongoose.model('Tour', tourSchema, 'tours');
exports.User = mongoose.model('User', userSchema, 'users');