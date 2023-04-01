// <!-- WEB 450 Mastering the MEAN Stack Bootcamp
// Contributors

// Contributors:
// Richard Krasso
// Thomas James Schultz -->

const mongoose = require('mongoose')
const Schema = mongoose.Schema
//itemSchema set to type string
let itemSchema = new Schema({
  text: { type: String }
})

module.exports = itemSchema
