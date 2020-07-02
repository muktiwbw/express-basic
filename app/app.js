const express = require('express');

const logger = require('./utils/logger');
const { AppError, GlobalError } = require('./utils/errorHandler');

const TourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const AuthRouter = require('./routes/authRouter');

const AuthMiddleware = require('./middlewares/authMiddleware');

class Application {
  constructor() {
    this.routePrefix = '/api/v1';

    this.app = express();

    /**Express extensions */
    this.app.use(express.json());
    this.app.use(express.static(`${__dirname}/public`));

    /**Logger */
    this.app.use(logger.badResponse);

    /**Routes */
    // * Auth Router
    this.app.use(`${this.routePrefix}/auth`, AuthRouter);

    // * Auth Middleware
    this.app.use(AuthMiddleware.tokenVerification.bind(AuthMiddleware));

    // * Protected Routes
    this.app.use(`${this.routePrefix}/tours`, TourRouter);
    this.app.use(`${this.routePrefix}/users`, userRouter);

    /**
     * * 404 route handler
     * *  The idea is that if a request reaches this bottom,
     * *  means that no route handler has actually accepted it.
     * *  Means that it's a 404 request. 
     * */
    this.app.all('*', (req, res, next) => {
      next(new AppError(`Endpoint named ${req.originalUrl} not found`, 404));
    });

    // * Global error handler
    this.app.use(GlobalError.handler.bind(GlobalError));
  }
}

module.exports = new Application().app;