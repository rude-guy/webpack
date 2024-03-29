/**
 * 对比转化前和转化后的两颗AST可以得出： https://astexplorer.net/
 * 1. output中将箭头函数的节点「ArrowFunctionExpression」替换成了「FunctionDeclaration」
 * 2. output中针对箭头函数的body，调用表单是声明「ExpressionStatement」时，传入的arguments从「ThisExpression」更改为了「Identifier」
 * 3. 同时output在箭头函数同作用域额外添加了一个变量声明，「var _this = this」
 */

/** 转化后的代码 */
// var _this = this;
// const arrowFn = function () {
//   console.log(_this);
// };

const babelTypes = require('@babel/types');

// 1. output中将箭头函数的节点「ArrowFunctionExpression」替换成了「FunctionDeclaration」
function ArrowFunctionExpression(path) {
  const { node } = path;
  hoistFunctionEnvironment(path);
  node.type = 'FunctionExpression';
}

function hoistFunctionEnvironment(nodePath) {
  // 往上查找 直到找到最近顶部非箭头函数的this => p.isFunction() && !p.isArrowFunctionExpression()
  // 或者找到跟节点 p.isProgram()
  const thisEnvFn = nodePath.findParent((p) => {
    return (p.isFunction() && !p.isArrowFunctionExpression()) || p.isProgram();
  });
  // 接下来查找当前作用域中那些地方用到了this的节点路径
  const thisPaths = getScopeInfoInformation(thisEnvFn);
  const thisBindingsName = generateBindName(thisEnvFn);
  // thisEnvFn中添加一个变量 变量名为thisBindingsName 变量值为「this」
  // 3. 同时output在箭头函数同作用域额外添加了一个变量声明，「var _this = this」
  thisEnvFn.scope.push({
    // 调用babelTypes中生成对应节点
    // 详细你可以在这里查阅到 https://babeljs.io/docs/en/babel-types
    id: babelTypes.identifier(thisBindingsName),
    init: babelTypes.thisExpression(),
  });
  // 2. output中针对箭头函数的body，调用表单是声明「ExpressionStatement」时，传入的arguments从「ThisExpression」更改为了「Identifier」
  thisPaths.forEach((thisPath) => {
    // 将this替换为_this
    const replaceNode = babelTypes.identifier(thisBindingsName);
    thisPath.replaceWith(replaceNode);
  });
}

/** 查找当前作用域内this使用的地方 */
function getScopeInfoInformation(nodePath) {
  const thisPaths = [];
  // 调用nodePath中的traverse方法进行遍历
  // 你可以在这里查阅到  https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md
  nodePath.traverse({
    // 深度遍历节点路径 找到内部this语句
    ThisExpression(thisPath) {
      thisPaths.push(thisPath);
    },
  });
  return thisPaths;
}

// 判断之前是否存在 _this 这里简单处理下
function generateBindName(path, name = '_this', n = '') {
  if (path.scope.hasBinding(name)) {
    generateBindName(path, `${name}${n}`, parseInt(n) + 1);
  }
  return name;
}

const arrowFunctionPlugin = () => {
  return {
    visitor: {
      ArrowFunctionExpression,
    },
  };
};

module.exports = arrowFunctionPlugin;
