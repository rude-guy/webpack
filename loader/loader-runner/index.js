const fs = require('fs');
const path = require('path');
// const { runLoaders } = require('loader-runner');
const { runLoaders } = require('./core/index');

// 模块路径
const filePath = path.resolve(__dirname, './title.js');

// 模拟模块内容和./title.js一摸一样的内容
const request = 'inline1-loader!inline2-loader!./title.js';

// 模拟webpack配置
const rules = [
  // 普通loader
  {
    test: /\.js$/,
    use: ['normal1-loader', 'normal2-loader'],
  },
  // 前置loader
  {
    test: /\.js$/,
    use: ['pre1-loader', 'pre2-loader'],
    enforce: 'pre',
  },
  // 后置loader
  {
    test: /\.js$/,
    use: ['post1-loader', 'post2-loader'],
  },
];

// 从文件引入路径中提取inline loader 同时将文件路径的「-!、!!、!」等标志inline-loader等规则删除掉
const parts = request.replace(/^-?!+/, '').split('!');

// 获取文件路径
const sourcePath = parts.pop();

// 获取inlineLoader
const inlineLoaders = parts;

// 处理rules中的loader规则
const preLoaders = [],
  normalLoaders = [],
  postLoaders = [];

rules.forEach((rule) => {
  // 如果匹配情况如下
  if (rule.test.test(sourcePath)) {
    switch (rule.enforce) {
      case 'pre':
        preLoaders.push(...rule.use);
        break;
      case 'post':
        postLoaders.push(...rule.use);
        break;
      default:
        normalLoaders.push(...rule.use);
        break;
    }
  }
});

/**
 * 根据inlineLoader的规则过滤需要的loader
 * https://webpack.js.org/concepts/loaders/#inline
 * !: 排除「normal-loader」
 * !!: 排除「pre」「normal」「post」，只剩下「inline-loader」
 * -!: 排除「pre」「normal」
 */
let loaders = [];
if (request.startsWith('!!')) {
  loaders.push(...inlineLoaders);
} else if (request.startsWith('-!')) {
  loaders.push(...postLoaders, ...inlineLoaders);
} else if (request.startsWith('!')) {
  loaders.push(...postLoaders, ...inlineLoaders, ...preLoaders);
} else {
  loaders.push(...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders);
}

// 将loader转化为loader所在文件路径
// webpack下默认是针对配置中的resolveLoader的路径进行解析 这里为了模拟我们省略webpack中的路径解析
const resolveLoader = (loader) => path.resolve(__dirname, './loaders', loader);

loaders = loaders.map(resolveLoader);

// 获取需要处理的loaders路径
runLoaders(
  {
    resource: filePath, // 加载的模块路径
    loaders, // 需要处理的loaders数组
    context: { name: 'loader-test' }, // 传递的上下文对象
    readResource: fs.readFile.bind(fs), // 读取文件的方法
  },
  (err, result) => {
    console.log(err, '错误日志');
    console.log(result, '结果');
  }
);
