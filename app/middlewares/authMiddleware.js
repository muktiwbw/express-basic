const Middleware = require('./../config/middleware');
const { AppError } = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const env = require('./../config/env');
const User = require('../models/userModel');

class AuthMiddleware extends Middleware {
  constructor() {
    super();
  }

  catchAsync(fn, req, res, next) {
    fn(req, res, next).catch(next);
  }

  tokenVerification(req, res, next) {
    const fn = async (req, res, next) => {
      // 1. Check header if contains token
      if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        next(new AppError('Missing authorization token', 400));
      }    
  
      // 2. Verify token
      const token = req.headers.authorization.split(' ')[1];
      const payload = await promisify(jwt.verify)(token, env.appSecret);
  
      // 3. Check if user still exists
      const user = await User.findById(payload._id).select('+passwordUpdatedAt');
      
      if (!user) {
        return next(new AppError('The user account you\'re currently logged in doesn\'t exist anymore', 401));
      }
  
      // 4. Check if token was issued after last password change
      if (!user.tokenIssuedAfterLastPasswordChange(payload.iat, user.passwordUpdatedAt)) {
        return next(new AppError('You just changed your password recently. Please re-login.', 401));
      }

      // 5. Assign user to request so that the next middleware doesn't have to query
      req.user = user;
  
      next();
    }

    this.catchAsync(fn, req, res, next);
  }

  restrictedTo(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(new AppError('You don\'t have permission to perform this action', 403));
      }

      next();
    }
  }
}

module.exports = new AuthMiddleware();