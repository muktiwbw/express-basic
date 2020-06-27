const dotenv = require('dotenv');

class Environment {
  constructor() {
    this.appEnv = process.env.NODE_ENV || 'development';
    this.loadConfig();

    this.dbUri = this.loadDbUri();
    this.appPort = process.env.APP_PORT || 3000;
  }

  loadConfig() {
    let envFileName;

    switch (this.appEnv) {
      case 'development':
        envFileName = '.env';
        break;
        
      case 'production':
        envFileName = 'prod.env';
        break;
        
      default:
        envFileName = '.env';
        break;
    }

    dotenv.config({path: `${__dirname}/../../${envFileName}`});
  }

  loadDbUri() {
    let uri;

    switch (process.env.DB_DRIVER) {
      /**Add additional database driver here... */
      case 'atlas':
        uri = 'mongodb+srv://$DB_USERNAME$:$DB_PASSWORD$@$DB_HOST$/$DB_DATABASE$?retryWrites=true&w=majority'
        uri = uri
          .replace('$DB_USERNAME$', process.env.DB_USERNAME)
          .replace('$DB_PASSWORD$', process.env.DB_PASSWORD)
          .replace('$DB_HOST$', process.env.DB_HOST)
          .replace('$DB_DATABASE$', process.env.DB_DATABASE);
        break;
    
      default:
        break;
    }

    return uri;
  }
}

// let envFileName, dbUri;

// switch (process.env.NODE_ENV) {
//   case 'development':
//     envFileName = '.env';
//     break;
    
//   case 'production':
//     envFileName = 'prod.env';
//     break;
    
//   default:
//     envFileName = '.env';
//     break;
// }

// dotenv.config({path: `${__dirname}/../../${envFileName}`});

// switch (process.env.DB_DRIVER) {
//   /**
//    * Add additional database driver here...
//    */
//   case 'atlas':
//     dbUri = 'mongodb+srv://$DB_USERNAME$:$DB_PASSWORD$@$DB_HOST$/$DB_DATABASE$?retryWrites=true&w=majority'
//     dbUri = dbUri
//       .replace('$DB_USERNAME$', process.env.DB_USERNAME)
//       .replace('$DB_PASSWORD$', process.env.DB_PASSWORD)
//       .replace('$DB_HOST$', process.env.DB_HOST)
//       .replace('$DB_DATABASE$', process.env.DB_DATABASE);
//     break;

//   default:
//     break;
// }

// exports.appEnv = process.env.NODE_ENV || 'development';
// exports.appPort = process.env.APP_PORT || 3000;
// exports.dbUri = dbUri;

module.exports = Environment;