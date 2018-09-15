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

const isComponent = obj =>
  obj.extends &&
  obj.extends.some(name => ['Component', 'React.Component'].includes(name))

const classType = obj => (isComponent(obj) ? 'component' : 'class')

function print(parsedObjects) {
  parsedObjects.forEach(obj => {
    // console.log('obj', obj)
    const type = classType(obj)

    switch (type) {
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
