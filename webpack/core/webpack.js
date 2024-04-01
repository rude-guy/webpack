const Compiler = require('./compiler');

function webpack(options) {
  // 1. 初始化参数 根据配置文件和shell参数合成参数
  const mergeOptions = _mergeOptions(options);
  // 创建compiler对象
  const compiler = new Compiler(mergeOptions);
  // 加载插件
  _loadPlugin(options.plugins, compiler);
  return compiler;
}

// 加载插件函数
function _loadPlugin(plugins, compiler) {
  if (Array.isArray(plugins)) {
    plugins.forEach((plugin) => plugin.apply(compiler));
  }
}

// 合并参数
function _mergeOptions(options) {
  const shellOptions = process.argv.slice(2).reduce((option, argv) => {
    // argv --mode=production
    const [key, value] = argv.split('=');
    if (key && value) {
      const parserKey = key.slice(2);
      option[parserKey] = value;
    }
    return option;
  }, {});
  return { ...options, ...shellOptions };
}

module.exports = webpack;
