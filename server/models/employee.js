// <!-- WEB 450 Mastering the MEAN Stack Bootcamp
// Contributors

// Contributors:
// Richard Krasso
// Thomas James Schultz -->


const mongoose = require('mongoose')

const Schema = mongoose.Schema
//importing itemSchema
const itemSchema = require('./item')

//employee schema, setting all values to their types
let employeeSchema = new Schema({
  empId: { type: Number, unique: true, required: true},
  firstName: { type: String},
  lastName: { type: String},
  todo: [itemSchema],
  done: [itemSchema]
}, { collection: 'employees'})

module.exports = mongoose.model('Employee', employeeSchema)
