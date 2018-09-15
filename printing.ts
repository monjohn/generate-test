function printComponent(component, filename) {
  return `
import { ${component.name} } from './${filename}'

const defaultProps = {
    
}

const newComponent = (props) => shallow(
    <Printing
        {...defaultProps}
        {...props}
    />
)

const component = newComponent()
describe('<${component.name} />', () => {
  it('renders', () => {
    expect(component).toMatchSnapshot()
  })
})

 `
}

function print(parsedObjects) {
  parsedObjects.forEach(obj => {
    console.log(obj.type)

    switch (obj.type) {
      case 'component':
        const result = printComponent(obj, 'sample')
        console.log(result)
        break
      default:
        console.log(JSON.stringify(obj))
    }
  })
}

module.exports = { print }
