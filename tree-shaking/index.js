const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');
const code = fs.readFileSync(path.resolve(__dirname, './input.js'), 'utf8');

const treeShakingPlugin = require('./plugins/tree-shaking');

const targetCode = babel.transform(code, {
  plugins: [treeShakingPlugin],
});

console.log(targetCode.code);
