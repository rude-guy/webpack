const { AsyncParallelBailHook } = require('tapable');

const hook = new AsyncParallelBailHook(['arg1', 'arg2', 'arg3']);

console.time('timer');

hook.tapAsync('tap1', (arg1, arg2, arg3, callback) => {
  console.log('tap1', arg1, arg2, arg3);
  // 需要调用callback才能结束tap1的执行
  setTimeout(callback, 1000, true);
});

// tap1 不会执行
hook.tapPromise('tap2', (arg1, arg2, arg3) => {
  // tapPromise 需返回promise
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('tap2', arg1, arg2, arg3);
      resolve();
    }, 3000);
  });
});

hook.callAsync('arg1 ', 'arg2 ', 'arg3 ', () => {
  console.log('执行完毕done');
  console.timeEnd('timer');
});

// tap1 arg1  arg2  arg3
// 执行完毕done
// timer: 1.007s
/** 由于之前使用setTimeout并未被终止，依然会执行 */
// tap2 arg1  arg2  arg3
