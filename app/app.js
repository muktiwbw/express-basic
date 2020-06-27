const express = require('express');

const logger = require('./utils/logger');

const tourRouter = require('./routes/tourRoute');
// const userRouter = require('./routes/userRoute');

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
    this.app.use(`${this.routePrefix}/tours`, tourRouter);
    // this.app.use(`${this.routePrefix}/users`, userRouter);
  }
}

module.exports = Application;