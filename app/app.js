const express = require('express');

const logger = require('./utils/logger');
const { AppError, GlobalError } = require('./utils/errorHandler');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const TourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const AuthRouter = require('./routes/authRouter');

const AuthMiddleware = require('./middlewares/authMiddleware');
const reviewRouter = require('./routes/reviewRouter');

class Application {
  constructor() {
    this.routePrefix = '/api/v1';
    this.limiter = rateLimit({
      max: 50,
      windowMs: 5 * 60 * 1000
    });

    this.app = express();
    
    this.app.use(helmet());

    /**Express extensions */
    this.app.use(express.json({ limit: '10kb' }));

    this.app.use(mongoSanitize());
    this.app.use(xss());
    this.app.use(hpp());

    this.app.use(express.static(`${__dirname}/public`));
    this.app.use(this.limiter);

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
    this.app.use(`${this.routePrefix}/reviews`, reviewRouter);

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