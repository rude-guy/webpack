/**
 * stage 值越大执行时机越晚
 * 如果同时使用 before 和 stage 时，优先会处理 before ，在满足 before 的条件之后才会进行 stage 的判断。
 */

const { SyncHook } = require('tapable');

/** 初始化同步钩子 */
const hook = new SyncHook(['arg1', 'arg2', 'arg3']);

// hook.tap(
//   {
//     name: 'tap1',
//   },
//   () => {
//     console.log('tap1 function execute');
//   }
// );

// hook.tap(
//   {
//     name: 'tap2',
//     before: 'tap1',
//   },
//   () => {
//     console.log('tap2 function execute');
//   }
// );

// hook.call();

// tap2 function execute
// tap1 function execute

hook.tap(
  {
    name: 'tap1',
    stage: 1,
  },
  () => {
    console.log('tap1 function execute');
  }
);

hook.tap(
  {
    name: 'tap2',
    // stage: 0 默认值
  },
  () => {
    console.log('tap2 function execute');
  }
);

hook.call();
