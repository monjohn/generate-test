const ts = require('typescript')

let tsSourceFile

function makeSourceFile(sourceCode, filename) {
  filename = filename || __filename
  return ts.createSourceFile(filename, sourceCode, ts.ScriptTarget.Latest)
}

const syntaxKind = {}
function populateNames() {
  // workarounds issue described at https://github.com/Microsoft/TypeScript/issues/18062
  for (const name of Object.keys(ts.SyntaxKind).filter(x =>
    isNaN(parseInt(x))
  )) {
    const value = ts.SyntaxKind[name]
    if (!syntaxKind[value]) {
      syntaxKind[value] = name
    }
  }
  return syntaxKind
}
populateNames()

const nodeKind = node => syntaxKind[node.kind]
const getName = node => node.name.escapedText

function debugNode(node) {
  console.log(nodeKind(node), node)
}

function parentClassName(node) {
  const flatten = arr => arr.reduce((acc, val) => acc.concat(val), [])

  if (node.heritageClauses) {
    return flatten(parseNodes(node.heritageClauses))
  }
}

function parseClass(node) {
  return {
    name: getName(node),
    extends: parentClassName(node),
    members: parseNodes(node.members),
  }
}

function parseHeritageClause(node) {
  return parseNodes(node.types)
}

const expressionName = expression => expression.getFullText(tsSourceFile).trim()

function parseExpression(node) {
  return expressionName(node.expression)
}

function parseExpressionWithTypes(node) {
  const expression = {}

  if (node.typeArguments) {
    expression['types'] = parseNodes(node.typeArguments)
  }

  if (node.expression) {
    expression['name'] = expressionName(node.expression)
  }
  return expression
}

function parseTypeLiteral(node) {
  return Object.assign({}, ...parseNodes(node.members))
}

function parsePropertySignature(node) {
  return {
    [getName(node)]: parseNode(node.type),
  }
}

function parseMethod(node) {
  return getName(node)
}

function parseNode(node) {
  switch (nodeKind(node)) {
    case 'ClassDeclaration':
      return parseClass(node)
    case 'HeritageClause':
      return parseHeritageClause(node)
    case 'ExpressionWithTypeArguments':
      return parseExpressionWithTypes(node)
    case 'Expression':
      return parseExpression(node)
    case 'MethodDeclaration':
      return parseMethod(node)
    case 'PropertySignature':
      return parsePropertySignature(node)
    case 'TypeLiteral':
      return parseTypeLiteral(node)
    case 'ArrayType':
      return `Array of ${parseNode(node.elementType)}`
    case 'FunctionType':
      return 'function'
    case 'TupleType':
      return `Tuple of ${parseNodes(node.elementTypes).join(', ')}`
    case 'AnyKeyword':
      return 'any'
    case 'BooleanKeyword':
      return 'boolean'
    case 'NullKeyword':
      return 'null'
    case 'NumberKeyword':
      return 'number'
    case 'StringKeyword':
      return 'string'
    case 'UndefinedKeyword':
      return 'undefined'
    case 'VoidKeyword':
      return 'void'

    case 'ImportDeclaration':
      // return getName(node.importClause)
      return null
    default:
      console.log('\n')
      console.log('PRINTING DEFAULT')
      console.log(syntaxKind[node.kind])
      console.log(node)
      console.log('\n')
  }
}

const parseNodes = nodes => nodes.map(parseNode)

const parse = sourceCode => {
  tsSourceFile = makeSourceFile(sourceCode, __filename)
  const parsed = parseNodes(tsSourceFile.statements).filter(n => n)
  return Promise.resolve(parsed)
}

module.exports = { parse }
