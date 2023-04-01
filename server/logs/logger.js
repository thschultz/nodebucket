// <!-- WEB 450 Mastering the MEAN Stack Bootcamp
// Contributors

// Contributors:
// Richard Krasso
// Thomas James Schultz -->

//debugLog and errorlog

const { appendFileSync, appendFile } = require('fs')

const { join } = require('path')

//joining debuglog from directory
const debugLog = join(__dirname, 'debug.log')
//joining errorLog from directory
const errorLog = join(__dirname, 'error.log')

//creating a time variable
const getDateTime = () => {
  const now = new Date()
  return now.toLocaleDateString('en-US')
}

//sending information to debug.log
module.exports.debugLogger = (data) => {
  const logString =`[${getDateTime()}] server\t ${data.filename} = ${data.message}\n`
  appendFileSync(debugLog, logString)
}

//sending information to error.log
module.exports.errorLogger = (data) => {
  const logString =`[${getDateTime()}] server\t ${data.filename} = ${data.message}\n`
  appendFileSync(errorLog, logString)
}
