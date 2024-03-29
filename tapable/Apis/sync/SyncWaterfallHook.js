/**
 * 瀑布钩子会将上一个函数的返回值传递给下一个函数作为参数
 */
const { SyncWaterfallHook } = require('tapable');

const hook = new SyncWaterfallHook(['arg1', 'arg2', 'arg3']);

hook.tap('tap1', (arg1, arg2, arg3) => {
  console.log('tap1:', arg1, arg2, arg3);
  // 存在返回值, 修改tap2实参
  return 'tap1返回值';
});

hook.tap('tap2', (arg1, arg2, arg3) => {
  console.log('tap2:', arg1, arg2, arg3);
  return 'tap2返回值';
});

hook.tap('tap3', (arg1, arg2, arg3) => {
  console.log('tap3:', arg1, arg2, arg3);
});

hook.call('arg1', 'arg2', 'arg3');
// 只能修改第一个参数
// tap1: arg1 arg2 arg3
// tap2: tap1返回值 arg2 arg3
// tap3: tap2返回值 arg2 arg3
