function printDefaultProps(component) {
  return component ? JSON.stringify(component.extends.types[0]) : '{}'
}

function printComponent(component, filename) {
  return `import { ${component.name} } from './${filename}'

const defaultProps = 
  ${printDefaultProps(component)}  


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

const isComponent = classObj =>
  classObj.extends &&
  ['Component', 'React.Component'].includes(classObj.extends.name)

const classType = obj => (isComponent(obj) ? 'component' : 'class')

function print(parsedObjects, fileName = 'placeholder') {
  parsedObjects.forEach(obj => {
    console.log(JSON.stringify(obj))
    const type = classType(obj)

    switch (type) {
      case 'component':
        const result = printComponent(obj, fileName)
        console.log(result)
        break
      default:
        console.log(JSON.stringify(obj))
    }
  })
}

module.exports = { print }
