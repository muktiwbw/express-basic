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

// const Tour = mongoose.model('Tour', tourSchema, 'tours');

/**
 * To create documents, use this:
 * const tour = new Tour({
    name: 'Journey to Drangelic',
    price: 1000
  });

  tour.save().then(doc => console.log(doc))
 */

/**
 * ...or this:
 * const tour = Tour
              .create({
                name: 'Liberio Massacre',
                rating: 5,
                price: 2000
              })
              .then(doc => console.log(doc))
              .catch(err => console.log(err));
 */