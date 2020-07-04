const Controller = require('./../config/controller');
const User = require('./../models/userModel');

const { AppError } = require('../utils/errorHandler');
const env = require('./../config/env');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Mailer = require('./../utils/mailer');

class AuthController extends Controller {
  constructor() {
    super();
  }

  register(req, res, next) {
    const fn = async (req, res, next) => {
      const body = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
      };

      const user = await User.create(body);

      if (!user) return next(new AppError('Unable to create user account', 500));

      return res
              .status(201)
              .json({
                status: 'created',
                data: {
                  user: { 
                    name: user.name, 
                    email: user.email, 
                    role: user.role,
                    createdAt: user.createdAt 
                  }
                }
              });
    };

    this.catchAsync(fn, req, res, next);
  }

  login(req, res, next) {
    const fn = async (req, res, next) => {
      const { email, password } = req.body;
      
      // * Check if body has email and password
      if (!email || !password) return next(new AppError('Missing email or password field', 400));

      // * Check if user exists
      const user = await User.findOne({ email }).select('+password');
      
      // * Check if password matches
      if (!user || !(await user.passwordMatch(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
      }

      // * Generate JWT
      const token = jwt.sign({ _id: user._id }, env.appSecret, { expiresIn: env.jwtExpiresIn })

      // * Cookies (will move it to utils later)
      const cookieOption = {
        expires: new Date(Date.now() + env.jwtCookieExpiresIn * 24 * 60 * 60 *1000),
        httpOnly: true
      };

      if (env.appEnv === 'production') cookieOption.secure = true;

      res.cookie('jwt', token, cookieOption);

      // * Return token
      return res
              .status(200)
              .json({
                status: 'authorized',
                data: {
                  token: token
                }
              });
    };

    this.catchAsync(fn, req, res, next);
  }

  forgotPassword(req, res, next) {
    const fn = async (req, res, next) => {
      // Check if email is provided
      if (!req.body.email) return next(new AppError('Missing email field'));
  
      // Check if user exists
      const user = await User.findOne({ email: req.body.email });

      if (!user) return next(new AppError(`User with email address ${req.body.email} doesn't exist`));
  
      // Generate token with short expiration time
      const token = jwt.sign({ _id: user._id }, env.appSecret, { expiresIn: env.jwtResetPasswordExpiresIn });
  
      // Send mail containing reset token
      const mailer = new Mailer();

      await mailer.setSender({
        from: 'reset@natours.com',
        to: user.email,
        subject: 'Reset Password',
        text: `Send a PATCH request to http://localhost:3000/auth/resetPassword/${token}`
      }).send();

      // Returns
      return res
              .status(200)
              .json({
                status: 'success',
                message: 'Password reset email has been sent'
              });
    }

    this.catchAsync(fn, req, res, next);
  }

  resetPassword(req, res, next) {
    const fn = async (req, res, next) => {
      // * Verify token
      const payload = await promisify(jwt.verify)(req.params.token, env.appSecret);

      // * Check if token is not yet expired
      // * * No need. Apparently the API handled this as well.

      // * Update password and token last updated at
      const user = await User.findById(payload._id);

      if (!user) return next(new AppError('User with current id not found', 404));

      // * Also update the passwordConfirm to run the validation
      // * Use save() to run validation and also run the pre middleware
      user.password = req.body.password;
      user.passwordConfirm = req.body.passwordConfirm;
      await user.save();

      // * Return
      return res
              .status(201)
              .json({
                status: 'updated',
                data: {
                  user: {
                    name: user.name, 
                    email: user.email, 
                    role: user.role,
                    createdAt: user.createdAt 
                  }
                }
              });

    };

    this.catchAsync(fn, req, res, next);
  }
}

module.exports = new AuthController();