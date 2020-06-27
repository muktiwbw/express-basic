const Environment = require('./../config/env');
const mongoose = require('mongoose');

const env = new Environment;

mongoose.connect(env.dbUri, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true
}).then(() => console.log('Database connection is established...'));

module.exports = mongoose;