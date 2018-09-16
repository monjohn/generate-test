const fs = require('fs')
const path = require('path')
const util = require('util')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const filePath = process.argv[2]

const makeFilePath = fileName => path.resolve(__dirname, fileName)

function fileContents(file) {
  const filePath = makeFilePath(file)

  return readFile(filePath, { encoding: 'utf8' }).catch(err => {
    throw `\nSomething went wrong. Here is the error message: \n ${err.message}`
  })
}

function writeToFile(testCode, filename) {
  const withoutFiletype = filename.replace(/\.[^/.]+$/, '')
  const filePath = makeFilePath(withoutFiletype + '.test.js')

  writeFile(filePath, testCode).catch(err => {
    throw `\nSomething went wrong. Here is the error message: \n ${err.message}`
  })
}

module.exports = { fileContents, writeToFile }
