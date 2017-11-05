#!/usr/bin/env node
const util = require('util');
const babylon = require('babylon');
const chalk = require('chalk');

const code = `const greeting = (name) => "Hello " + name`;

const AST = babylon.parse(code);

console.log(
  chalk.yellow('const') +
  ' greeting = ' +
  '(name) ' +
  chalk.yellow('=>') + ' ' +
  chalk.green('"Hello "') +
  ' + name' + '\n'
);

console.log(util.inspect(AST, false, null));

