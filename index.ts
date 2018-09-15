const parsing = require('./parsing.ts')
const printing = require('./printing.ts')
const io = require('./io.ts')

module.exports = () => {
  const args = process.argv.slice(2)
  const fileName = args[0]
  io.fileContents(fileName)
    .then(parsing.parse)
    .then(sourceCode => printing.print(sourceCode, fileName))
    .catch(e => {
      console.log(e)
    })
}
