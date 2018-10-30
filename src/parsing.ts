const ts = require('typescript')
const _ = require('lodash')

let tsSourceFile
const syntaxKind = populateNames()

function makeSourceFile(sourceCode) {
  return ts.createSourceFile('data.tsx', sourceCode, ts.ScriptTarget.Latest)
}

function populateNames() {
  // workarounds issue described at https://github.com/Microsoft/TypeScript/issues/18062
  return Object.keys(ts.SyntaxKind)
    .filter(x => isNaN(parseInt(x)))
    .reduce((acc, name) => {
      const value = ts.SyntaxKind[name]
      return !acc[value] ? _.set(acc, value, name) : acc
    }, {})
}

const nodeKind = node => syntaxKind[node.kind]

const getName = node => node.name.escapedText

function debugNode(node) {
  console.log('debugNode')
  console.log(nodeKind(node), node)
}

function parentClass(node) {
  if (node.heritageClauses) {
    return parseNode(node.heritageClauses[0])
  }
}

function parseClass(node) {
  return {
    name: getName(node),
    kind: 'class',
    extends: parentClass(node),
    members: parseNodes(node.members),
  }
}

function parseHeritageClause(node) {
  return parseNode(node.types[0])
}

function parseArrowFunction(node) {
  return {
    kind: 'arrowFunction',
    body: parseNode(node.body),
    types: parseNode(node.parameters[0].type),
  }
}

function parseFunctionDeclaration(node) {
  return {
    kind: 'functionDeclaration',
    name: getName(node),
    types: _.fromPairs(parseNodes(node.parameters)),
    body: parseNode(node.body),
  }
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
    expression['expressionName'] = expressionName(node.expression)
  }
  return expression
}

function parseParameter(node) {
  const name = getName(node)
  if (name) {
    return [name, parseNode(node.type)]
  }
}

function parseTypeAliasDeclaration(node) {
  return [
    'declaration',
    { nameOfType: getName(node), type: parseNode(node.type) },
  ]
}

function parseTypeLiteral(node) {
  return Object.assign({}, ...parseNodes(node.members))
}

function parseTypeReference(node) {
  return ['reference', node.typeName.escapedText]
}

function parsePropertySignature(node) {
  return {
    [getName(node)]: parseNode(node.type),
  }
}

const parseMethod = node => getName(node)

function parseVariableDeclaration(node) {
  return {
    kind: 'variable',
    name: getName(node),
    initializer: parseNode(node.initializer),
  }
}

function parseVariableStatement(node) {
  // TODO: handle more than one declaration
  return parseNodes(node.declarationList.declarations)[0]
}

function parseNode(node) {
  switch (nodeKind(node)) {
    case 'VariableDeclaration':
      return parseVariableDeclaration(node)
    case 'VariableStatement':
      return parseVariableStatement(node)
    case 'FunctionDeclaration':
      return parseFunctionDeclaration(node)
    case 'ArrowFunction':
      return parseArrowFunction(node)
    case 'Parameter':
      return parseParameter(node)
    case 'Block':
      // Only looking at last statement in block
      return parseNode(_.last(node.statements))
    case 'ReturnStatement':
      return parseNode(node.expression)
    case 'ClassDeclaration':
      return parseClass(node)
    case 'HeritageClause':
      return parseHeritageClause(node)
    case 'ParenthesizedExpression':
      return parseNode(node.expression)
    case 'ExpressionWithTypeArguments':
      return parseExpressionWithTypes(node)
    case 'Expression':
      return parseExpression(node)
    case 'MethodDeclaration':
      return parseMethod(node)
    case 'PropertySignature':
      return parsePropertySignature(node)
    case 'TypeAliasDeclaration':
      return parseTypeAliasDeclaration(node)
    case 'TypeLiteral':
      return parseTypeLiteral(node)
    case 'TypeReference':
      return parseTypeReference(node)
    case 'ArrayType':
      return `Array of ${parseNode(node.elementType)}`
    case 'JsxElement':
    case 'JsxSelfClosingElement':
      return 'JsxElement'
    case 'FunctionType':
      return 'function'
    case 'LiteralType':
      return node.literal.text
    case 'TupleType':
      return `Tuple of ${parseNodes(node.elementTypes).join(', ')}`
    case 'UnionType':
      return ['union', ...parseNodes(node.types)]
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
