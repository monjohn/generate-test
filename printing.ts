const util = require('util')

const sampleData = {
  string: 'example',
  number: 87,
  boolean: true,
}

function typeToData(types) {
  Object.keys(types).forEach(key => {
    const type = types[key]

    types[key] = sampleData[type]
  })
  return types
}

function printDefaultProps(component) {
  const types = component.extends ? component.extends.types[0] : '{}'
  const withData = typeToData(types)
  // return JSON.stringify(withData)
  return util.inspect(withData)
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
  const printed = parsedObjects.map(obj => {
    console.log(JSON.stringify(obj))
    const type = classType(obj)

    switch (type) {
      case 'component':
        const result = printComponent(obj, fileName)
        // console.log(result)
        return result
      default:
        console.log(JSON.stringify(obj))
        const result1 = JSON.stringify(obj)
        return result1
    }
  })

  return Promise.resolve(printed.join('\n'))
}

module.exports = { print }
