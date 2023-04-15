// <!-- WEB 450 Mastering the MEAN Stack Bootcamp
// Contributors

// Contributors:
// Richard Krasso
// Thomas James Schultz -->

/**
 * Require statements
 */
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const createError = require('http-errors');
const EmployeeRoute = require('./routes/employee-route');
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

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

app.use('/api/employees', EmployeeRoute);


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


const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NodeBucket API's",
      version: "1.0.0",
    },
  },
  apis: ["./server/routes/*.js"],
};

// Swagger specific options
const openapiSpecification = swaggerJsdoc(options);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// Routes
app.use("/api/employees", EmployeeRoute);

// Root request.
app.get("/", (req, res) => {
  res.send("Welcome to the nodebucket!");
});


app.use(function (req, res, next) {
  next(createError(404));
});


app.use(function (err, req, res, next) {
  res.status(err.status || 500);


  res.send({
    type: "error",
    status: err.status,
    message: err.message,
    stack: req.app.get("env") === "development" ? err.stack : undefined,
  });
});


app.listen(PORT, () => {
  console.log("Application started and listening on PORT: " + PORT);
});


