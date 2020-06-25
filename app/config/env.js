const dotenv = require('dotenv');

let envFileName, dbUri;

switch (process.env.NODE_ENV) {
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

switch (process.env.DB_DRIVER) {
  case 'atlas':
    dbUri = 'mongodb+srv://$DB_USERNAME$:$DB_PASSWORD$@$DB_HOST$/$DB_DATABASE$?retryWrites=true&w=majority'
    dbUri = dbUri
      .replace('$DB_USERNAME$', process.env.DB_USERNAME)
      .replace('$DB_PASSWORD$', process.env.DB_PASSWORD)
      .replace('$DB_HOST$', process.env.DB_HOST)
      .replace('$DB_DATABASE$', process.env.DB_DATABASE);
    break;

  default:
    break;
}

exports.nodeEnv = process.env.NODE_ENV || 'development';
exports.serverPort = process.env.SERVER_PORT || 3000;
exports.dbUri = dbUri;