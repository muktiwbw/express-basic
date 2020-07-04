const Controller = require('./../config/controller');
const User = require('../models/userModel');
const { AppError } = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const env = require('./../config/env');

class UserController extends Controller {
  constructor() {
    super();
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

  updateInfo(req, res, next) {
    const fn = async (req, res, next) => {
      // * 1. Filter only allowed field to be updated
      const filteredBody = this.filterBody(req.body, ['name', 'email']);
  
      // * 2. Update info
      const user = await User.findByIdAndUpdate(req.params.id, filteredBody, { runValidators: true, new: true });
      
      // * 3. Return
      return res
              .status(201)
              .json({
                status: 'updated',
                message: 'Your info has been updated',
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

  deleteSelf(req, res, next) {
    const fn = async (req, res, next) => {
      const user = await User.findByIdAndUpdate(req.user._id, { active: false });

      return res
              .status(204)
              .json({
                status: 'deleted',
                message: 'User has been deleted',
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


module.exports = new UserController();