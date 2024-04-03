const jszip = require('jszip');
const { RawSource } = require('webpack-sources');
const pluginName = 'CompressAssetsPlugin';

class CompressAssetsPlugin {
  // 在配置文件传入的参数会保存在插件实例中
  constructor({ output }) {
    // 接收外部传入的output参数
    this.output = output;
  }

  apply(compiler) {
    // 注册函数 在webpack即将输出打包文件内容时执行
    // AsyncSeriesHook 将assets输出到output目录之前调用该钩子
    compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {
      // 创建zip对象
      const zip = new jszip();
      // 获取本次打包所有的assets资源
      const assets = compilation.getAssets();
      assets.forEach(({ name, source }) => {
        // 调用source()方法获取对应的源代码 这是一个源代码字符串
        const sourceCode = source.source();
        // 往zip对象中添加资源名称和资源代码内容
        zip.file(name, sourceCode);
      });
      // 调用zip.generatorAsync 生成zip压缩包
      zip.generateAsync({ type: 'nodebuffer' }).then((result) => {
        // 通过new RawSource创建压缩包
        // 并且同时通过 compilation.emitAsset 方法将生成的zip压缩包输出到this.output
        compilation.emitAsset(this.output, new RawSource(result));
        // 调用callback 表示本次事件函数结束
        callback();
      });
    });
  }
}

module.exports = CompressAssetsPlugin;
