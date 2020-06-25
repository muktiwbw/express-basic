const fs = require('fs');
const express = require('express');
const mongoose = require('./config/database');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoute');
const userRouter = require('./routes/userRoute');

const app = express();

// Stream function to write error logs
const writeErrorLogs = fs.createWriteStream(`${__dirname}/logs/errorlogs.log`, {flags: 'a'});
// Middleware to only write logs if response status is 400 or above
app.use(morgan('combined', {
  skip: (req, res) => {return res.statusCode < 400},
  stream: writeErrorLogs
}));

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requested_at = new Date().toISOString();

  next();
});


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