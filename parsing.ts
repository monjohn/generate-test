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

function classType(obj) {
  if (
    obj.extends &&
    obj.extends.some(name => ['Component', 'React.Component'].includes(name))
  ) {
    return 'component'
  } else {
    return 'class'
  }
}

function parseClass(node) {
  const parsed = {
    name: node.name.escapedText,
    extends: parseParentClass(node),
    members: parseNodes(node.members),
  }

  parsed['type'] = classType(parsed)
  return parsed
}

function parseHeritageClause(node) {
  return parseNodes(node.types)
}

function parseParentClass(node) {
  const flatten = arr => arr.reduce((acc, val) => acc.concat(val), [])

  if (node.heritageClauses) {
    return flatten(parseNodes(node.heritageClauses))
  }
  console.log('No Heritage Clauses =========')
}

function getName(node) {}

function parseExpressionWithTypes(node) {
  console.log('Expression Wtih Types')

  if (node.types) {
    return parseNodes(node.types)
  }

  if (node.expression) {
    return node.expression.getFullText(tsSourceFile).trim()
  }
  console.log('NoTYPES')
}

function parseExpression(node) {
  return node.expression.getFullText(tsSourceFile)
}

function parseMethod(node) {
  return node.name.escapedText
}

function parseNode(node) {
  switch (syntaxKind[node.kind]) {
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
  return Promise.resolve(parseNodes(tsSourceFile.statements))
}

module.exports = { parse }
