const { HookMap, SyncHook } = require('tapable');

// 创建HookMap实例
const keyedHook = new HookMap(() => new SyncHook(['arg']));

// 在keyedHook中创建一个name为key1的hook，同时为该hook通过tap注册事件
keyedHook.for('key1').tap('plugin1', (arg) => {
  console.log('plugin1', arg);
});

// 在keyedHook中创建一个name为key2的hook，同时为该hook通过tap注册事件
keyedHook.for('key2').tap('plugin2', (arg) => {
  console.log('plugin2', arg);
});

// 在keyedHook中创建一个name为key3的hook，同时为该hook通过tap注册事件
keyedHook.for('key3').tap('plugin3', (arg) => {
  console.log('plugin3', arg);
});

const hook = keyedHook.get('key1');
hook && hook.call('trigger');

// plugin1 trigger
