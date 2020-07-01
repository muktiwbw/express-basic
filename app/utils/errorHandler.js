const env = require('./../config/env');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
  }
}

class GlobalError {
  constructor() {
    // 
  }

  handler(error, req, res, next) {
    if (env.appEnv === 'development') {
      return res
              .status(error.statusCode || 500)
              .json({
                status: error.status || 'Error',
                name: error.name,
                error: error,
                message: error.message || 'Unexpected error',
                stack: error.stack
              });
    } else if (env.appEnv === 'production') {
      let statusCode, status, message;
      
      if (error.name === 'CastError') {
        statusCode = 400;
        status = 'bad-request';
        message = `Invalid value for ${error.path}: ${error.value}`;
      } else if (error.name === 'MongoError' && error.code === 11000) {
        statusCode = 400;
        status = 'bad-request';
        const value = error.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
        message = `Duplicate value of ${value}`;
      } else if (error.name === 'ValidationError') {
        statusCode = 400;
        status = 'validation-error';
        message = Object.values(error.errors).map(e => `${e.properties.path} (${e.properties.type.toUpperCase()}) => ${e.properties.message}`);
      }

      return res
              .status(statusCode || 500)
              .json({
                status: status || error.name,
                message: message || error.message
              });
    }
  }
}

exports.AppError = AppError;
exports.GlobalError = new GlobalError();