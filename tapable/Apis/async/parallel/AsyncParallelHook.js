const { AsyncParallelHook } = require('tapable');

const hook = new AsyncParallelHook(['arg1', 'arg2', 'arg3']);

console.time('timer');

hook.tapAsync('tap1', (arg1, arg2, arg3, callback) => {
  console.log('tap1', arg1, arg2, arg3);
  // 需要调用callback才能结束tap1的执行
  setTimeout(callback, 1000);
});

// tap1 不会执行
hook.tapPromise('tap2', (arg1, arg2, arg3) => {
  console.log('tap2', arg1, arg2, arg3);
  // tapPromise 需返回promise
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
});

hook.callAsync('arg1 参数', 'arg2 参数', 'arg3 参数', () => {
  console.log('执行完毕done');
  console.timeEnd('timer');
});

// tap1 arg1 参数 arg2 参数 arg3 参数
// tap2 arg1 参数 arg2 参数 arg3 参数
// 执行完毕done
// timer: 1.006s
