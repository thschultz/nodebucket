const mongoose = require('mongoose')

const Schema = mongoose.Schema

let employeeSchema = new Schema({
  empId: { type: Number, unique: true, required: true},
  firstName: { type: String},
  lastName: { type: String}
}, { collection: 'employees'})

module.exports = mongoose.model('Employee', employeeSchema)
