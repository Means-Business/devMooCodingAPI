const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const logger = require('./middleware/logs');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

const app = express();

// Body parser
app.use(express.json());

// Http request logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const ROOT_URL = `http://localhost:${PORT}`;

const server = app.listen(PORT, err => {
  if (err) logger.error(`> Error: ${err.message}`.red.bold);
  logger.info(
    `> Server is running in ${process.env.NODE_ENV} mode on url ${ROOT_URL}`
      .cyan.underline.bold
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(colors.red.bold(`> Error: ${err.message}`));
  // Close server & exit process
  server.close(() => process.exit(1));
});
