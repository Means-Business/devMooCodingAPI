const ErrorResponse = require('../utils/errorResponse');
const logger = require('../middleware/logs');

const colors = require('colors');
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  console.log(error);
  logger.error(JSON.stringify(`let error = ${error}`));
  console.log(error.message);
  logger.error(`let error message = ${error.message}`);

  error.message = err.message;
  console.log(error.message);
  logger.error(`let new error message = ${error.message}`);

  // Log to console for dev
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    let messageLength = Object.values(err.errors).length;
    console.log(messageLength);
    const message = Object.values(err.errors).map(val => {
      if (messageLength >= 2) {
        // console.log(val.message + 'and');
        --messageLength;
        return val.message;
      } else {
        return `and ${val.message}`;
        // console.log(val.message);
      }
    });
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
