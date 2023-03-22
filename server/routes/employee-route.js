const express = require('express')
const Employee = require('../models/employee')

const router = express.Router()

router.get('/:id', (req, res, next) => {

  let empId = req.params.id

  empId = parseInt(empId, 10)

  if (isNaN(empId)) {
    const err = new Error('Bad Request')
    console.error('empId could not be parsed:', err.message)
    err.status = 400
    next(err)
  } else {

    Employee.findOne({'empId': req.params.id}, function(err, emp){
      if (err) {
        console.error('mongodb error:', err)
        next(err)
      } else {
        console.log('emp:', emp)
        res.send(emp)
      }
    })
  }
})

module.exports = router
