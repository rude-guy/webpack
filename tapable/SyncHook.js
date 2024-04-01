// @ts-ignore
const Hook = require('./Hook');

const HookCodeFactory = require('./HookCodeFactory');

class SyncHookCodeFactory extends HookCodeFactory {
  content({ onError, onDone, rethrowIfPossible }) {
    return this.callTapsSeries({
      onError: (i, err) => onError(err),
      onDone,
      rethrowIfPossible,
    });
  }
}
const factory = new SyncHookCodeFactory();

const TAP_ASYNC = () => {
  throw new Error('tapAsync is not supported on a SyncHook');
};

const TAP_PROMISE = () => {
  throw new Error('tapPromise is not supported on a SyncHook');
};

/**
 * 为什么使用动态编译？
 * https://github.com/webpack/tapable/issues/162#issuecomment-1980153775
 * */
const COMPILE = function (options) {
  // 将注册的函数复制给 hooks._x 属性
  factory.setup(this, options);
  // 返回编译后到函数
  return factory.create(options);
};

function SyncHook(args = [], name = undefined) {
  const hook = new Hook(args, name);
  hook.constructor = SyncHook;
  /** 同步钩子不能使用异步API创建抛出异常 */
  hook.tapAsync = TAP_ASYNC;
  /** 同步钩子不能使用异步API创建抛出异常 */
  hook.tapPromise = TAP_PROMISE;
  /** 编译模块 */
  hook.compile = COMPILE;
  return hook;
}

/** 重置原型 */
SyncHook.prototype = null;

module.exports = SyncHook;
