const dotenv = require('dotenv');

let envFileName;

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

exports.nodeEnv = process.env.NODE_ENV || 'development';
exports.serverPort = process.env.SERVER_PORT || 3000;