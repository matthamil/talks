const util = require('util');
const chalk = require('chalk');
const tokenizer = require('./tokenizer');

const code = 'const greeting = (name) => "Hello " + name';

console.log(
  chalk.yellow('const') +
  ' greeting = ' +
  '(name) ' +
  chalk.yellow('=>') + ' ' +
  chalk.green('"Hello "') +
  ' + name' + '\n'
);

console.log('Tokenized code:\n');
console.log(tokenizer(code));
