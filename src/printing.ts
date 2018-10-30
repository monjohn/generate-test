const util = require('util')

// Returns if a value is an object
const isObject = value =>
  value && typeof value === 'object' && value.constructor === Object

const isArray = value => Array.isArray(value)

const sampleData = {
  string: 'example',
  number: 87,
  boolean: true,
  function: 'FUNCTION',
}

function typeToData(types) {
  if (typeof types === 'string') return {}
  // TODO: cover more than first case
  if (isArray(types)) return typeToData(types[0])

  Object.keys(types).forEach(key => {
    const type = types[key]

    if (isArray(type)) {
      types[key] = type[1]
    } else if (isObject(type[key])) {
      types[key] = typeToData(types[key])
    } else {
      types[key] = sampleData[type]
    }
  })
  return types
}

const mapTypes = parsedObjects =>
  parsedObjects.reduce((acc, obj) => {
    if (isArray(obj)) {
      const [kind, typeInfo] = obj
      if (kind === 'declaration') {
        const { nameOfType, type } = typeInfo
        acc[nameOfType] = type
      }
    }
    return acc
  }, {})

function resolveReference(type, typeMap) {
  if (isObject(type)) {
    Object.entries(type).forEach(([key, value]) => {
      type[key] = resolveReference(value, typeMap)
    })
    return type
  }

  if (isArray(type)) {
    const [metaData, typeData] = type

    if (metaData === 'reference') {
      const resolvedType = typeMap[typeData]
      return resolveReference(resolvedType, typeMap)
    }
  }
  return type
}

function resolveTypes(parsedObjects) {
  const typeMap = mapTypes(parsedObjects)

  const javascriptObjects = parsedObjects.filter(o => !Array.isArray(o))

  return javascriptObjects.map(object => {
    let types
    if (object.kind === 'class') {
      types = object.extends.types.map(t => resolveReference(t, typeMap))

      object.types = types
      return object
    } else if (object.kind === 'variable') {
      object.types = resolveReference(object.types, typeMap)
      return object
    } else {
      return object
    }
  })
}

function printDefaultProps(component) {
  const withData = typeToData(component.types)

  return util.inspect(withData).replace(/'FUNCTION'/, '() => {}')
}

const isComponent = classObj =>
  classObj.extends &&
  ['Component', 'React.Component'].includes(classObj.extends.expressionName)

const classType = obj => (isComponent(obj) ? 'component' : 'class')

// PRINT
// Type information comes in as an array, while javascript information is an object
function print(parsedObjects, fileName = 'placeholder') {
  console.log('\n')
  console.log(parsedObjects)

  const objectsToPrint = resolveTypes(parsedObjects)
  const namesToImport = []

  const tests = objectsToPrint.map(obj => {
    switch (obj.kind) {
      case 'class':
        let result
        if (classType(obj)) {
          namesToImport.push(obj.name)
          result = printComponent(obj, fileName)
        } else {
          result = JSON.stringify(obj)
        }
        // console.log(result)
        return result
      case 'variable':
        if (
          obj.initializer.kind === 'arrowFunction' &&
          obj.initializer.body === 'JsxElement'
        ) {
          namesToImport.push(obj.name)

          obj.types = obj.initializer.types

          const variable = printComponent(obj, fileName)

          return variable
        }
      case 'functionDeclaration':
        if (obj.body === 'JsxElement') {
          namesToImport.push(obj.name)

          const func = printComponent(obj, fileName)
          console.log('other', JSON.stringify(func))
          return func
        }

      default:
        console.log('other', JSON.stringify(obj))
        const result1 = JSON.stringify(obj)
        return result1
    }
  })

  const done = appendImports(fileName, namesToImport, tests.join('\n'))
  console.log(done)

  return Promise.resolve(done)
}

function appendImports(filename, variableNames, tests) {
  return `import { ${variableNames.join(', ')} } from './${filename}'
  
${tests}`
}

function printComponent(component, filename) {
  console.log('\n')

  return `  describe('<${component.name} />', () => {
  
    const default${component.name}Props = ${printDefaultProps(component)}  

  const newComponent = (props) => shallow(
    <${component.name}
        {...default${component.name}Props}
        {...props}
    />
  )

  it('renders', () => {
    const component = newComponent()

    expect(component).toMatchSnapshot()
  })
})

 `
}

module.exports = { print }
