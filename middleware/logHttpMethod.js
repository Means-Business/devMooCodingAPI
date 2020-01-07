// @desc Logs request to console
const logger = require('./logs');

const logHttpMethod = (req, res, next) => {
  logger.info(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
  next();
};

module.exports = logHttpMethod;
