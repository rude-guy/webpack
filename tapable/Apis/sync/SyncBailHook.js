/**
 * 如果任何事件函数存在返回值，那么会立即中断后续事件函数的调用
 */
const { SyncBailHook } = require('tapable');

const hook = new SyncBailHook(['arg1', 'arg2', 'arg3']);

hook.tap('tap1', (arg1, arg2, arg3) => {
  console.log('tap1', arg1, arg2, arg3);
  // 存在返回值(不是undefined)，会中断tap2及后续钩子的执行
  return true;
});

hook.tap('tap2', (arg1, arg2, arg3) => {
  console.log('tap2', arg1, arg2, arg3);
});

hook.call('arg1 参数', 'arg2 参数', 'arg3 参数');

// tap1 arg1 参数 arg2 参数 arg3 参数
