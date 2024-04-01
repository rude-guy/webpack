const { SyncHook } = require('tapable');
const fs = require('fs');
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
    // 保持所有入口模块对象
    this.entries = new Set();
    // 保持所有依赖模块对象
    this.modules = new Set();
    // 所有的代码块对象
    this.chunks = new Set();
    // 存放本次产出的文件对象
    this.assets = new Set();
    // 存放本次编译所有产出的文件名
    this.files = new Set();
  }

  // run方法启动编译
  // 同时run方法接受外部传递到callback
  run(callback) {
    // 当调用run时，触发开始编译的plugin
    this.hooks.run.call();
    // 获取入口配置对象
    const entry = this.getEntry();
    // 编译入口文件
    this.buildEntryModule(entry);
  }

  buildEntryModule(entry) {
    Object.keys(entry).forEach((entryName) => {
      const entryPath = entry[entryName];
      const entryObj = this.buildModule(entryName, entryPath);
      this.entries.add(entryObj);
    });
  }

  // 编译模块方法
  buildModule(moduleName, modulePath) {
    // 1. 读取文件的原始代码
    const originSourceCode = (this.originSourceCode = fs.readFileSync(modulePath, 'utf-8'));
    // moduleCode 为修改后的代码
    this.moduleCode = originSourceCode;
    // 2. 调用loader进行处理
    this.handleLoader(modulePath);
    return {};
  }

  handleLoader(modulePath) {
    const matchLoaders = [];
    // 1. 获取所有传入的loader桂枝
    const rules = this.options.module.rules;
    rules.forEach((rule) => {
      const testRule = rule.test;
      if (testRule.test(modulePath)) {
        if (rule.loader) {
          // 仅考虑loader { test:/\.js$/g, use:['babel-loader'] }, { test:/\.js$/, loader:'babel-loader' }
          matchLoaders.push(rule.loader);
        } else {
          matchLoaders.push(...rule.use);
        }
      }
      for (let i = matchLoaders.length - 1; i >= 0; i--) {
        // 目前外部仅支持绝对路径的loaders模式
        // require 引入对应的loader
        const loaderFn = require(matchLoaders[i]);
        // 通过loader同步处理我的每一次编译的moduleCode
        this.moduleCode = loaderFn(this.moduleCode);
      }
    });
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
