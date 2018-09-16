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

const mapTypes = parsedObjects =>
  parsedObjects.reduce((acc, obj) => {
    if (Array.isArray(obj)) {
      const [kind, typeInfo] = obj
      if (kind === 'declaration') {
        const { nameOfType, type } = typeInfo
        acc[nameOfType] = type
      }
    }
    return acc
  }, {})

function resolveReference(type, typeMap) {
  if (Array.isArray(type)) {
    const [metaData, typeData] = type

    if (metaData === 'reference') {
      const resolvedType = typeMap[typeData]
      return resolvedType
    } else {
      return type
    }
  }
}

function resolveTypes(parsedObjects) {
  const typeMap = mapTypes(parsedObjects)

  const javascriptObjects = parsedObjects.filter(o => !Array.isArray(o))

  return javascriptObjects.map(object => {
    let types = object.extends.types
    types = types.map(t => resolveReference(t, typeMap))

    object.extends.types = types
    return object
  })
}

function printDefaultProps(component) {
  const types = component.extends ? component.extends.types[0] : '{}'
  const withData = typeToData(types)

  return util.inspect(withData)
}

const isComponent = classObj =>
  classObj.extends &&
  ['Component', 'React.Component'].includes(classObj.extends.expressionName)

const classType = obj => (isComponent(obj) ? 'component' : 'class')

// PRINT
function print(parsedObjects, fileName = 'placeholder') {
  const objectsToPrint = resolveTypes(parsedObjects)

  const printed = objectsToPrint.map(obj => {
    const type = classType(obj)

    switch (type) {
      case 'component':
        const result = printComponent(obj, fileName)
        // console.log(result)
        return result
      default:
        console.log('other', JSON.stringify(obj))
        const result1 = JSON.stringify(obj)
        return result1
    }
  })

  return Promise.resolve(printed.join('\n'))
}

function printComponent(component, filename) {
  return `import { ${component.name} } from './'

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

module.exports = { print }
