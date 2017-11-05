/**
 * Well, this is isn't complete. Oops.
 */
function parseNumber(tokens, current) {
  return [ current + 1, { type: 'NumberLiteral', value: tokens[current].value } ];
}

function parseString(tokens, current) {
  return [ current + 1, { type: 'StringLiteral ', value: tokens[current].value } ];
}

function parseExpression(tokens, current) {
  let token = tokens[++current];
  let node = {
    type: 'CallExpression',
    name: token.value,
    params: []
  };
  token = tokens[++current];
  while (current < tokens.length) {
    [ current, param ] = parseToken(tokens, current);
    node.params.push(param);
    token = tokens[current];
  }
  current++;
  return [ current, node ];
}

function parseArrowFunction(tokens, current) {
  let node = {
    type: 'FunctionDeclaration',
    name: tokens[current - 2],
    params: tokens[current ]
  }
}

function parseVariableDeclaration(tokens, current) {
  let node = {
    type: 'VariableDeclaration',
    name: tokens[current],
    id: {
      type: 'Identifier',
      name: tokens[current + 1]
    }
  };

  return [ 2, node ];
}

function parseToken(tokens, current) {
  let token = tokens[current];
  switch (token.type) {
    case 'ParenOpen': return;
    case 'ParenClose': return;
    case 'VariableDeclaration': return;
    case 'Number': return;
    case 'Identifier': return;
    case 'AdditionOperator': return;
    case 'SubtractionOperator': return;
    case 'AssignmentOperator': return;
    case 'ArrowFunction': return parseArrowFunction(tokens, current);
    default: throw new TypeError('Not sure what type of token this is: ', token);
  }
}
