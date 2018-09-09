const parsing = require('./parsing.ts')

const sourceCode = `
class View extends Component {
    render() {
        return <Div />
    }
}
`

const parsed = parsing.parse(sourceCode)

function print(input) {
  console.log(JSON.stringify(input))
}

print(parsed)
