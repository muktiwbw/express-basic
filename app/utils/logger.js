const fs = require('fs');
const morgan = require('morgan');
const moment = require('moment-timezone');

/** ===================================================================================================
 * Token Configurations
 *  Configure custom token before using it in logging format
 * ====================================================================================================
 */

/**Convert default timezone into local timezone */
morgan.token('date', (req, res, timezone = 'UTC') => {
  // 26/Jun/2020:23:21:42 +0000
  return moment().tz(timezone).format('DD/MMM/YYYY:HH:mm:ss Z');
})

/** ===================================================================================================
 * Custom Logging Formats
 * ====================================================================================================
 */

/**Combined format with local timezone */
morgan.format('combined-local-timezone', ':remote-addr - :remote-user [:date[Asia/Jakarta]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"');

/** ===================================================================================================
 * Loggers
 * ====================================================================================================
 */

/**
 * Bad Response Logger
 *  Logs all response with status code >400
 */
const badResponseStream = fs.createWriteStream(`${__dirname}/../logs/errorlogs.log`, {flags: 'a'});

exports.badResponse = morgan('combined-local-timezone', {
  skip: (req, res) => {return res.statusCode < 400},
  stream: badResponseStream
});