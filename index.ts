const parsing = require('./src/parsing.ts')
const printing = require('./src/printing.ts')
const io = require('./src/io.ts')

module.exports = () => {
  const args = process.argv.slice(2)
  const fileName = args[0]
  io.fileContents(fileName)
    .then(parsing.parse)
    .then(sourceCode => printing.print(sourceCode, fileName))
    .then(testCode => io.writeToFile(testCode, fileName, 'utf8'))
    .catch(e => {
      console.log(e)
    })
}
