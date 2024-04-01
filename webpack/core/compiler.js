const { SyncHook } = require('tapable');

// Compiler类进行核心编译实现
class Compiler {
  constructor(options) {
    this.options = options;
    // 创建plugin hooks
    this.hooks = {
      // 开始编译时的钩子
      run: new SyncHook(),
      // 输出asset到output目录之前执行（写入文件之前）
      emit: new SyncHook(),
      // 在compilation完成执行 全部完成编译执行
      done: new SyncHook(),
    };
  }

  // run方法启动编译
  // 同时run方法接受外部传递到callback
  run(callback) {}
}

module.exports = Compiler;
