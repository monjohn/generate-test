const parsing = require('./src/parsing.ts')
const printing = require('./src/printing.ts')
const io = require('./src/io.ts')
const path = require('path')

module.exports = () => {
  const args = process.argv.slice(2)
  const filePath = args[0]
  const fileName = path.basename(filePath)

  io.fileContents(filePath)
    .then(parsing.parse)
    .then(sourceCode => printing.print(sourceCode, fileName))
    .then(testCode => io.writeToFile(testCode, filePath, 'utf8'))
    .catch(e => {
      console.log(e)
    })
}
