const mongoose = require('mongoose');
const Environment = require('./env');

class Database {
  constructor() {
    this.mongoose = mongoose;
    this.mongoose
          .connect(Environment.dbUri, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
          })
          .then(() => console.log('Database connection is established...'))
          .catch(() => console.log('Error connecting to database'));
  }
}

module.exports = Database;