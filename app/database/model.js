const env = require('./../config/env');
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
  /**
   * Fields required
   * - name (string, required, unique, trim)
   * - duration (number, required)
   * - maxGroupSize (number, required)
   * - difficulty (string, required) --> this one should be enum
   * - ratingAverage (number, default 0)
   * - ratingQuantity (number, default 0)
   * - price (number, required)
   * - priceDiscount (number)
   * - summary (string, trim) --> on the overview page, should be required but it doesn't matter
   * - description (string, trim)
   * - imageCover (string, required)
   * - images (string-array),
   * - createdAt (date, default now) --> try timestamp
   * - startDates (date-array)
   */
  name: {
    type: String,
    required: [true, 'Missing name field'],
    unique: [true, 'Conflicting name with existed data'],
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Missing duration field']
  },
  difficulty: {
    type: String,
    required: [true, 'Missing difficulty field'],
    enum: ['easy', 'medium', 'difficult']
  },
  ratingAverage: {
    type: Number,
    default: 0
  },
  ratingQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Missing price field']
  },
  priceDiscount: {
    type: Number
  },
  summary: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'Missing imageCover field']
  },
  images: {
    type: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: {
    type: [Date]
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