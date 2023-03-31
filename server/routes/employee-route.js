const express = require('express');
const Employee = require('../models/employee');
const { debugLogger, errorLogger} = require('../logs/logger');
const createError = require('http-errors');
const router = express.Router();
const Ajv = require('ajv');
const BaseResponse = require('../models/base-response');

const myFile = 'employee-route.js';
const ajv = new Ajv()

const checkNum = (id) => {

  id = parseInt(id,10)

  if(isNaN(id)) {
    const err = new Error('Bad request')
    err.status = 400
    console.error('id could not be parsed: ', id)
    return err
  } else {
    return false
  }
}

const taskSchema = {
  type: 'object',
  properties: {
    text: { type: 'string'}
  },
  required: ['text'],
  additionalProperties: false
}

router.get('/:id', (req, res, next) => {

  let empId = req.params.id

  const err = checkNum(empId)

  if (err === false) {
    Employee.findOne({'empId': req.params.id}, function(err, emp){
      if (err) {
        console.error('mongodb error:', err)
        errorLogger({filename: myFile, message: `mongodb error: ${err.message}`})
        next(err)
      } else {
        console.log('emp:', emp)
        debugLogger({filename: myFile, message: emp})
        res.send(emp)
      }
    })
  } else {
    console.error('id could not be parsed:', empId)
    errorLogger({filename: myFile, message: `id could not be parsed: ${empId}`})
    next(err)
  }

})

/**findAllTasks
 * 400 - Bad Request: route.params.id is not a number
 * 404 - Not found: MongoDB returns a null record; employee ID not found
 * 200 - success
 * 500 - server error for all other use cases
 *
 */

router.get("/:empId/tasks", async(req, res, next) => {
  // find the employee based on params employee ID

  let empId = req.params.empId
  const err = checkNum(empId)

  if ( err === false) {
    try {
      const emp = await Employee.findOne({'empId': empId}, 'empId todo done')

      if (emp) {
        console.log(emp)
        debugLogger({filename: myFile, message: emp})
        res.send(emp)
      } else {
        console.error(createError(404))
        errorLogger({filename: myFile, message: createError(404)})
        next(createError(404))
      }
    } catch (err) {
      // catching the server error
      errorLogger({filename: myFile, message: err})
      next(err)
    }
  } else {
    const errorString = `req.params must be a number: ${empId}`
    console.error(errorString)
    errorLogger({filename: myFile, message: errorString})
    next(err)
  }
});

/**
 * createTasks
 */

router.post("/:empId/tasks", async(req, res, next) => {
  let empId = req.params.empId

  const err = checkNum(empId)

  if (err === false) {
    try {
      let emp = await Employee.findOne({'empId': empId})

      if (emp) {
        const newTask = req.body
        const validator = ajv.compile(taskSchema)
        const valid = validator(newTask)

        if (!valid) {
        const err = Error('Bad Request')
        err.status = 400
        console.error('Bad request. Unable to validate req.body against the defined schema')
        errorLogger({filename: myFile, message: err})
        next(err)
        } else {
        emp.todo.push(newTask)
        const result = await emp.save()
        console.log(result)
        debugLogger({filename: myFile, message: result})

        const task = result.todo.pop()

        const newTaskResponse = new BaseResponse(201, 'Task item added successfully', {id: task._id})
        res.status(201).send(newTaskResponse)
        }
      } else {
        console.error(createError(404))
        errorLogger({filename: myFile, message: createError(404)})
        next(createError(404))
      }
    } catch {err} {
      next(err)
    }

  } else {
    console.error('req.params.empId must be a number', empId)
    errorLogger({filename: myFile, message: `req.params.empId must be a number: ${empId}`})
    next(err)
  }
});

module.exports = router
