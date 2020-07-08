const Controller = require('./../config/controller');
const User = require('../models/userModel');
const { AppError } = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const env = require('./../config/env');

class UserController extends Controller {
  constructor() {
    super();
  }

  getAllUsers(req, res, next) {
    this.getAll(User, req, res, next);
  }

  getOneUser(req, res, next) {
    this.getOne(User, req, res, next);
  }

  updatePassword(req, res, next) {
    const fn = async (req, res, next) => {
      // * 1. Get user
      const user = await User.findById(req.user._id).select('+password');
      
      // * 2. Check if current password is correct
      if (!req.body.currentPassword || !(await user.passwordMatch(req.body.currentPassword, user.password))) {
        return next(new AppError('Incorrect password. Please put the correct password'));
      }
      
      // * 3. Update
      user.password = req.body.newPassword;
      user.passwordConfirm = req.body.newPasswordConfirm;
      await user.save();

      // * 4. Refresh token
      const token = jwt.sign({ _id: user._id }, env.appSecret, { expiresIn: env.jwtExpiresIn });

      // * Cookies (will move it to utils later)
      const cookieOption = {
        expires: new Date(Date.now() + env.jwtCookieExpiresIn * 24 * 60 * 60 *1000),
        httpOnly: true
      };

      if (env.appEnv === 'production') cookieOption.secure = true;

      res.cookie('jwt', token, cookieOption);

      return res
              .status(201)
              .json({
                status: 'updated',
                message: 'Your password has been updated successfully',
                data: {
                  token: token,
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

  getMe(req, res, next) {
    req.params.id = req.user._id;
    
    this.getOne(User, req, res, next);
  }

  updateMe(req, res, next) {
    // * Filter only allowed field to be updated
    req.body = this.filterBody(req.body, ['name', 'email']);
    req.params.id = req.user._id;

    this.updateOne(User, req, res, next);
  }

  deleteMe(req, res, next) {
    req.params.id = req.user._id;
    req.body = { active: false };

    this.updateOne(User, req, res, next);
  }
}


module.exports = new UserController();