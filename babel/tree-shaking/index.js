// index.js
const core = require('@babel/core');
const babelPluginImport = require('./babel-plugin-import');

const sourceCode = `
  import { Button, Alert } from 'test-store';
`;

const parseCode = core.transform(sourceCode, {
  plugins: [
    babelPluginImport({
      libraryName: 'test-store',
    }),
  ],
});

console.log(sourceCode, '输入的Code');
console.log(parseCode.code, '输出的结果');

// import Button from "test-store/Button";
// import Alert from "test-store/Alert";
