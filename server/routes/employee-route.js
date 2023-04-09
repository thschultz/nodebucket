// <!-- WEB 450 Mastering the MEAN Stack Bootcamp
// Contributors

// Contributors:
// Richard Krasso
// Thomas James Schultz -->

const express = require('express');
const Employee = require('../models/employee');
const { debugLogger, errorLogger} = require('../logs/logger');
const createError = require('http-errors');
const router = express.Router();
const Ajv = require('ajv');
const BaseResponse = require('../models/base-response');

const myFile = 'employee-route.js';
const ajv = new Ajv()

// checking is id is a number
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

/** */

// tasks set as string
const taskSchema = {
  type: 'object',
  properties: {
    text: { type: 'string'}
  },
  required: ['text'],
  additionalProperties: false
}

const tasksSchema = {
  type: 'object',
  required: ['todo', 'done'],
  additionalProperties: false,
  properties: {
    todo: {
      type: 'array',
      additionalProperties: false,
      items: {
        type: 'object',
        properties: {
          text: {type: 'string'},
          _id: { type: 'string'}
        },
      required: ['text', '_id'],
      additionalProperties: false
      }
    },
    done: {
      type: 'array',
      additionalProperties: false,
      items: {
      type: 'object',
      properties: {
        text: {type: 'string'},
        _id: { type: 'string'}
      },
    required: ['text', '_id'],
    additionalProperties: false
    }
    }
  }
}

function getTask(id, tasks) {
  const task = tasks.find(item => item._id.toString() === id)
  return task
}

// router to get id
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

// posting tasks api
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
/**
 * updateTasks
 */

// updating tasks api
router.put('/:empId/tasks', async(req, res, next) => {
  let empId = req.params.empId
  empId = parseInt(empId, 10)

  if (isNaN(empId)) {
    const err = Error('input must be a number')
    err.status = 400
    console.error('input must be a number:', empId)
    errorLogger({filename: myFile, message: `req.params.empId must be a number ${empId}`})
    next(err)
    return
  }

  try {
    let emp = await Employee.findOne({'empId': empId})

    if (!emp) {
      console.error(createError(404))
      errorLogger({filename: myFile, message: createError(404)})
      next(createError(404))
      return
    }

    const tasks = req.body
    const validator = ajv.compile(tasksSchema)
    const valid = validator(tasks)

    if (!valid) {
      const err = Error('Bad request')
      err.status = 400
      console.error('Bad Request. Unable to validate req.body schema against tasksSchema')
      errorLogger({filename: myFile, message: `Bad Request. Unable to verify req.body against tasksSchema`})
      next(err)
      return
    }

    emp.set({
      todo: req.body.todo,
      done: req.body.done
    })

    const result = await emp.save()
    console.log(result)
    debugLogger({filename: myFile, message: result})
    res.status(204).send()


  } catch (err) {
    next(err)
  }

})

/**
 * deleteTasks
 */

// deleting tasks api
router.delete('/:empId/tasks/:taskId', async(req, res, next) => {
  let taskId = req.params.taskId
  let empId = req.params.empId

  empId = parseInt(empId, 10)

  if (isNaN(empId)) {
    const err = Error('input must be a number')
    err.status = 400
    console.error('req param.empId must be a number:', empId)
    errorLogger({filename: myFile, message: `req param.empId must be a number:${empId}`})
    next(err)
    return
  }
  try {

    let emp = await Employee.findOne({'empId': empId})

    if(!emp) {
    next(createError(404))
    console.error(createError(404))
    errorLogger({filename: myFile, message: createError(404)})
    next(err)
    return
  }

  const todoTask = getTask(taskId, emp.todo)
  const doneTask = getTask(taskId, emp.done)

  if (todoTask !== undefined) {
    emp.todo.id(todoTask._id).remove()
  }
  if(doneTask !== undefined) {
    emp.done.id(doneTask._id).remove()
  }
  if (todoTask === undefined && doneTask === undefined) {
    const err = Error('Not found')
    err.status - 404
    console.error('TaskID not found', taskId)
    errorLogger({filename: myFile, message: `TaskId not found ${taskId}`})
    next(err)
    return
  }

  const result = await emp.save()
  debugLogger({filename: myFile, message: result})
  res.status(204).send()

  } catch (err) {
    next(err)
  }
})

//exporting router
module.exports = router
