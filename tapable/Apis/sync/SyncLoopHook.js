/**
 * 在任意一个被监听的函数存在非 undefined 返回值时返回重头开始执行
 */
const { SyncLoopHook } = require('tapable');

const hook = new SyncLoopHook(['arg1', 'arg2', 'arg3']);

let tap1 = 1;
let tap2 = 1;

hook.tap('tap1', (arg1, arg2, arg3) => {
  console.log('tap1');
  if (tap1 != 2) {
    return tap1++;
  }
});

hook.tap('tap2', (arg1, arg2, arg3) => {
  console.log('tap2');
  if (tap2 !== 2) {
    return tap2++;
  }
});

hook.call('arg1', 'arg2', 'arg3');

// tap1
// tap1
// tap2
// tap1
// tap2
