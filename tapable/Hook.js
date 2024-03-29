const CALL_DELEGATE = function (...args) {
  // 每次调用都会this.call（实时编译）
  this.call = this._createCall('sync');
  return this.call(...args);
};

class Hook {
  constructor(args = [], name = undefined) {
    // 保存初始化Hook时传递的参数
    this._args = args;
    //
    this.name = name;
    // 保存通过tap注册的内容
    this.taps = [];
    // 保存拦截器相关内容
    this.interceptors = [];
    // hook.call 调用方法
    this._call = CALL_DELEGATE;
    this.call = CALL_DELEGATE;
    // _x存放hook中所有通过tap注册的函数
    this._x = undefined;
    // 动态编译方法
    this.compile = this.compile;
    // 相关hook注册方法
    this.tap = this.tap;

    // 异步方法，同步不会调用
    // this._callAsync = CALL_ASYNC_DELEGATE;
    // this.callAsync = CALL_ASYNC_DELEGATE;
    // this._promise = PROMISE_DELEGATE;
    // this.promise = PROMISE_DELEGATE;
    // this.tapAsync = this.tapAsync;
    // this.tapPromise = this.tapPromise;
  }

  compile(options) {
    throw new Error('Abstract: should be overridden');
  }

  _createCall(type) {
    // 编程最终生成的执行函数
    // compile是一个抽象类 需要在继承hook类的子类方法中实现
    return this.compile({
      taps: this.taps,
      interceptors: this.interceptors,
      args: this._args,
      type: type,
    });
  }

  _tap(type, options, fn) {
    if (typeof options === 'string') {
      options = {
        name: options.trim(),
      };
    } else if (typeof options !== 'object' || options === null) {
      throw new Error('Invalid tap options');
    }
    if (typeof options.name !== 'string' || options.name === '') {
      throw new Error('Missing name for tap');
    }
    if (typeof options.context !== 'undefined') {
      deprecateContext();
    }
    // 合并参数到options
    options = Object.assign({ type, fn }, options);
    // 执行拦截器中的所有的「register」
    options = this._runRegisterInterceptors(options);
    // 插入 options
    this._insert(options);
  }

  tap(options, fn) {
    this._tap('sync', options, fn);
  }

  _runRegisterInterceptors(options) {
    for (const interceptor of this.interceptors) {
      if (interceptor.register) {
        const newOptions = interceptor.register(options);
        if (newOptions !== undefined) {
          options = newOptions;
        }
      }
    }
    return options;
  }

  intercept(interceptor) {
    this._resetCompilation();
    this.interceptors.push(Object.assign({}, interceptor));
    if (interceptor.register) {
      for (let i = 0; i < this.taps.length; i++) {
        this.taps[i] = interceptor.register(this.taps[i]);
      }
    }
  }

  /**
   * 为什么每次tap都要调用_resetCompilation？
   * 因为调用的方法是实时编译的，每次调用个call方法会覆盖this.call。（对应CALL_DELEGATE方法）
   * 这一步操作为了一下次调用是最新编译的代码。
   */
  _resetCompilation() {
    this.call = this._call;
    // 异步方法，同步不需要执行
    // this.callAsync = this._callAsync;
    // this.promise = this._promise;
  }

  _insert(item) {
    this._resetCompilation();
    let before;
    // 获取before转化为Set去重
    if (typeof item.before === 'string') {
      before = new Set([item.before]);
    } else if (Array.isArray(item.before)) {
      before = new Set(item.before);
    }
    // 当前的优先级
    let stage = 0;
    if (typeof item.stage === 'number') {
      stage = item.stage;
    }
    let i = this.taps.length;
    while (i > 0) {
      i--;
      const x = this.taps[i];
      this.taps[i + 1] = x;
      const xStage = x.stage || 0;
      // 这里能看出before的优先级是高于state
      if (before) {
        if (before.has(x.name)) {
          before.delete(x.name);
          continue;
        }
        if (before.size > 0) {
          continue;
        }
      }
      if (xStage > stage) {
        continue;
      }
      i++;
      break;
    }
    // 存入到taps
    this.taps[i] = item;
  }
}

Object.setPrototypeOf(Hook.prototype, null);

module.exports = Hook;
