const { SyncHook } = require('tapable');
const path = require('path');
const { toUnixPath } = require('./utils');

// Compiler类进行核心编译实现
class Compiler {
  constructor(options) {
    this.options = options;
    // 相对路径根路径 Context参数
    this.rootPath = this.options.context || toUnixPath(process.cwd());
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
  run(callback) {
    // 当调用run时，触发开始编译的plugin
    this.hooks.run.call();
    // 获取入口配置对象
    const entry = this.getEntry();
  }

  // 获取入口文件路径
  getEntry() {
    let entry = Object.create(null);
    const { entry: optionsEntry } = this.options;
    if (typeof optionsEntry === 'string') {
      entry['main'] = optionsEntry;
    } else {
      entry = optionsEntry;
    }
    // 将entry变成绝对路径
    Object.keys(entry).forEach((key) => {
      const value = entry(key);
      if (!path.isAbsolute(value)) {
        entry[key] = toUnixPath(path.join(this.rootPath, value));
      }
    });
    return entry;
  }
}

module.exports = Compiler;
