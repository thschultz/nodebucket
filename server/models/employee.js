const mongoose = require('mongoose')

const Schema = mongoose.Schema

const itemSchema = require('./item')

let employeeSchema = new Schema({
  empId: { type: Number, unique: true, required: true},
  firstName: { type: String},
  lastName: { type: String},
  todo: [itemSchema],
  done: [itemSchema]
}, { collection: 'employees'})

module.exports = mongoose.model('Employee', employeeSchema)
