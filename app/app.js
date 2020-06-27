const express = require('express');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');

const logger = require('./utils/logger');

const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use(logger.badResponse);

/**
 * ================================================================================
 * ROUTES
 * ================================================================================
 */

const routePrefix = '/api/v1';

app.use(`${routePrefix}/tours`, tourRouter);
app.use(`${routePrefix}/users`, userRouter);

/**
 * ================================================================================
 * END ROUTES
 * ================================================================================
 */

module.exports = app;