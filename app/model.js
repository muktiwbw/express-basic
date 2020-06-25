const env = require('./config/env');
const mongoose = require('mongoose');

mongoose.connect(env.dbUri, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true
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
})

/**
 * MODEL
 * Create model based on schemas...
 */

exports.Tour = mongoose.model('Tour', tourSchema, 'tours');