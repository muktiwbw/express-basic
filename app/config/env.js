const dotenv = require('dotenv');

class Environment {
  constructor() {
    this.appEnv = process.env.NODE_ENV || 'development';
    this.loadConfig();

    this.dbUri = this.loadDbUri();
    this.appPort = process.env.APP_PORT || 3000;
    this.appSecret = process.env.APP_SECRET;

    this.mailHost = process.env.MAIL_HOST;
    this.mailPort = process.env.MAIL_PORT;
    this.mailUsername = process.env.MAIL_USERNAME;
    this.mailPassword = process.env.MAIL_PASSWORD;

    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN;
    this.jwtResetPasswordExpiresIn = process.env.JWT_RESET_PASSWORD_EXPIRES_IN;
    this.jwtCookieExpiresIn = process.env.JWT_COOKIE_EXPIRES_IN;
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

module.exports = new Environment();