// 插件A
class PluginA {
  apply(compiler) {
    // 注册同步钩子
    // 这里的compiler对象就是我们new Compiler()创建的实例
    compiler.hooks.run.tap('Plugin A', () => {
      console.log('Plugin A running');
    });
  }
}

module.exports = PluginA;
