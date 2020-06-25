const env = require('./env');
const mongoose = require('mongoose');

mongoose.connect(env.dbUri, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
}).then(() => console.log('Database connection is established...'));

module.exports = mongoose;