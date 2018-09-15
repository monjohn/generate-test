const fs = require('fs')
const path = require('path')
const util = require('util')

const readFile = util.promisify(fs.readFile)

const filePath = process.argv[2]

function fileContents(file) {
  const filePath = path.resolve(__dirname, file)

  return readFile(filePath, { encoding: 'utf8' }).catch(err => {
    throw `\nSomething went wrong. Here is the error message: \n ${err.message}`
  })
}

function writeToFile(filename) {}

module.exports = { fileContents }
