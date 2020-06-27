const mongoose = require('mongoose');
const Environment = require('./env');

class Database {
  constructor() {
    this.mongoose = mongoose;
    this.mongoose.connect(Environment.dbUri, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true
    }).then(() => console.log('Database connection is established...'));
  }
}

module.exports = Database;