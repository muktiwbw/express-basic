const env = require('./../config/env');
const mongoose = require('mongoose');

mongoose.connect(env.dbUri, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true
}).then(() => console.log('Database connection is established...'));

module.exports = mongoose;