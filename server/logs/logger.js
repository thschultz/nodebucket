const { appendFileSync, appendFile } = require('fs')

const { join } = require('path')

const debugLog = join(__dirname, 'debug.log')

const errorLog = join(__dirname, 'error.log')

const getDateTime = () => {
  const now = new Date()
  return now.toLocaleDateString('en-US')
}

module.exports.debugLogger = (data) => {
  const logString =`[${getDateTime()}] server\t ${data.filename} = ${data.message}\n`
  appendFileSync(debugLog, logString)
}


module.exports.errorLogger = (data) => {
  const logString =`[${getDateTime()}] server\t ${data.filename} = ${data.message}\n`
  appendFileSync(errorLog, logString)
}
