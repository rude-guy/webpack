/**
 * 基础钩子
 */
const { SyncHook } = require('tapable');

/** 初始化同步钩子 */
const hook = new SyncHook(['arg1', 'arg2', 'arg3']);

hook.tap('tap1', (arg1, arg2, arg3) => {
  console.log('tap1', arg1, arg2, arg3);
});

hook.tap('tap2', (arg1, arg2, arg3) => {
  console.log('tap2', arg1, arg2, arg3);
});

hook.call('arg1 参数', 'arg2 参数', 'arg3 参数');

// tap1 arg1 参数 arg2 参数 arg3 参数
// tap2 arg1 参数 arg2 参数 arg3 参数
