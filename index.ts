const parsing = require('./parsing.ts')
const printing = require('./printing.ts')
const io = require('./io.ts')

module.exports = () => {
  const args = process.argv.slice(2)
  io.fileContents(args[0])
    .then(parsing.parse)
    .then(printing.print)
    .catch(e => {
      console.log(e)
    })
}
