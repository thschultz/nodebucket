/**
 * Require statements
 */
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const createError = require('http-errors');
const EmployeeRoute = require('./routes/employee-route');

const app = express(); // Express variable.

/**
 * App configurations.
 */
app.use(express.json());
app.use(express.urlencoded({'extended': true}));
app.use(express.static(path.join(__dirname, '../dist/nodebucket')));
app.use('/', express.static(path.join(__dirname, '../dist/nodebucket')));

// default server port value.
const PORT = process.env.PORT || 3000;

// TODO: This line will be replaced with your database connection string (including username/password).
const CONN = 'mongodb+srv://nodebucket_user:s3cret@web335db.mtckmhy.mongodb.net/nodebucket?retryWrites=true&w=majority';

/**
 * Database connection.
 */
mongoose.connect(CONN).then(() => {
  console.log('Connection to the database was successful');
}).catch(err => {
  console.log('MongoDB Error: ' + err.message);
});

app.use('/api/employees', EmployeeRoute)

//Error Handlers for 404 errors
app.use(function(req, res, next) {
  next(createError(404))
})

  app.use(function(err, req, res, next) {
  res.status(err.status || 500)

  res.send({
    type: 'error',
    status: err.status,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined
  })
})

// Wire-up the Express server.
app.listen(PORT, () => {
  console.log('Application started and listening on PORT: ' + PORT);
})
