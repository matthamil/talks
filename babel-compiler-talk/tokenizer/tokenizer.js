function tokenizeCharacter(type, value, input, current) {
  if (value === input[current]) {
    return [ 1, { type, value } ]
  }

  return [ 0, null ];
}

function tokenizeParenOpen(input, current) {
  return tokenizeCharacter('ParenOpen', '(', input, current);
}

function tokenizeParenClose(input, current) {
  return tokenizeCharacter('ParenClose', ')', input, current);
}

function tokenizePattern(type, pattern, input, current) {
  let char = input[current];
  let consumedChars = 0;
  if (pattern.test(char)) {
    let value = '';
    while (char && pattern.test(char)) {
      if (isArrowFunc(char, input[current + 1])) {
        return tokenizeArrowFunction();
      }
      value += char;
      consumedChars++;
      char = input[current + consumedChars];
    }
    if (isKeyword(value)) {
      return tokenizeKeyword(value);
    }

    return [consumedChars, { type, value }];
  }
  return [0, null];
}

function isKeyword(chars) {
  const keywords = 'var let const';
  return keywords.includes(chars);
}

function tokenizeKeyword(keyword) {
  return [keyword.length, { type: 'VariableDeclaration', value: keyword }];
}

function tokenizeNumber(input, current) {
  return tokenizePattern('Number', /[0-9]/, input, current);
}

function tokenizeIdentifier(input, current) {
  return tokenizePattern('Identifier', /[a-z]/i, input, current);
}

function tokenizeString(input, current) {
  if (input[current] === '"') {
    let value = '';
    let consumedChars = 0;
    consumedChars++;
    char = input[current + consumedChars];
    while (char !== '"') {
      if (char === undefined) {
        throw new TypeError('unterminated string');
      }
      value += char;
      consumedChars++;
      char = input[current + consumedChars];
    }
    return [consumedChars + 1, { type: 'string', value }];
  }
  return [0, null];
}

function tokenizeAdditionOperator(input, current) {
  return tokenizePattern('AdditionOperator', /\+/, input, current);
}

function tokenizeSubtractionOperator(input, current) {
  return tokenizePattern('SubtractionOperator', /\-/, input, current);
}

function tokenizeAssignmentOperator(input, current) {
  return tokenizePattern('AssignmentOperator', /=/, input, current);
}

function isArrowFunc(char, nextChar) {
  return char === '=' && nextChar === '>';
}

function tokenizeArrowFunction() {
  return [2, { type: 'ArrowFunction', value: '=>' }];
}

function skipWhiteSpace(input, current) {
  if (/\s/.test(input[current])) {
    return [1, null];
  }
  return [0, null];
}

const tokenizers = [
  skipWhiteSpace,
  tokenizeParenOpen,
  tokenizeParenClose,
  tokenizeString,
  tokenizeNumber,
  tokenizeIdentifier,
  tokenizeAdditionOperator,
  tokenizeSubtractionOperator,
  tokenizeAssignmentOperator
];

function tokenizer(input) {
  let current = 0;
  let tokens = [];
  while (current < input.length) {
    let tokenized = false;
    tokenizers.forEach(tokenizerFn => {
      if (tokenized) return;
      let [ consumedChars, token ] = tokenizerFn(input, current);
      if (consumedChars !== 0) {
        tokenized = true;
        current += consumedChars;
      }
      if (token) {
        tokens.push(token);
      }
    });
    if (!tokenized) {
      throw new TypeError('Not sure what this character is: ' + input[current]);
    }
  }
  return tokens;
}

module.exports = tokenizer;
