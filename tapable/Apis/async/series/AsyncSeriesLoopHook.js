/**
 * 异步串行保险钩子
 */
const { AsyncSeriesLoopHook } = require('tapable');

const hook = new AsyncSeriesLoopHook(['arg1', 'arg2', 'arg3']);

console.time('timer');

let tap1 = 0;
let tap2 = 0;

/** 只能使用tapPromise调用 */
// tap1 不会执行
hook.tapPromise('tap1', (arg1, arg2, arg3) => {
  console.log('tap1:', arg1, arg2, arg3);
  // tapPromise 需返回promise reject会中断后续执行
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (++tap1 < 2) {
        resolve(tap1);
      } else {
        resolve();
      }
    }, 1000);
  });
});

hook.tapPromise('tap2', (arg1, arg2, arg3) => {
  console.log('tap2:', arg1, arg2, arg3);
  // tapPromise 需返回promise
  return new Promise((resolve) => {
    setTimeout(() => {
      if (++tap2 < 2) {
        resolve(tap1);
      } else {
        resolve();
      }
    }, 1000);
  });
});

hook.callAsync('arg1', 'arg2', 'arg3', () => {
  console.log('执行完毕done');
  console.timeEnd('timer');
});

// tap1: arg1 arg2 arg3
// tap1: arg1 arg2 arg3
// tap2: arg1 arg2 arg3
// tap1: arg1 arg2 arg3
// tap2: arg1 arg2 arg3
// 执行完毕done
// timer: 5.021s
