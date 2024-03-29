/**
 * 异步串行保险钩子
 */
const { AsyncSeriesWaterfallHook } = require('tapable');

const hook = new AsyncSeriesWaterfallHook(['arg1', 'arg2', 'arg3']);

console.time('timer');

/** 只能使用tapPromise调用 */
// tap1 不会执行
hook.tapPromise('tap2', (arg1, arg2, arg3) => {
  console.log('tap2:', arg1, arg2, arg3);
  // tapPromise 需返回promise reject会中断后续执行
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1000, 'tp2返回值');
  });
});

hook.tapPromise('tap3', (arg1, arg2, arg3) => {
  console.log('tap3:', arg1, arg2, arg3);
  // tapPromise 需返回promise
  return Promise.resolve();
});

hook.callAsync('arg1', 'arg2', 'arg3', () => {
  console.log('执行完毕done');
  console.timeEnd('timer');
});

// tap2: arg1 arg2 arg3
// tap3: tp2返回值 arg2 arg3
// 执行完毕done
// timer: 1.009s
