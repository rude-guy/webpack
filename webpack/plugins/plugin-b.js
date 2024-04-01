// 插件A
class PluginB {
  apply(compiler) {
    // 注册同步钩子
    // 这里的compiler对象就是我们new Compiler()创建的实例
    compiler.hooks.done.tap('Plugin B', () => {
      console.log('Plugin B done');
    });
  }
}

module.exports = PluginB;
