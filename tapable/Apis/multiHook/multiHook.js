const { MultiHook, SyncHook } = require('tapable');

const hook1 = new SyncHook(['arg']);
const hook2 = new SyncHook(['arg']);
const hook3 = new SyncHook(['arg']);

const multiHook = new MultiHook([hook1, hook2, hook3]);

multiHook.tap('plugin1', (args) => {
  console.log('plugin1', args);
});

multiHook.tap('plugin2', (args) => {
  console.log('plugin2', args);
});

multiHook.tap('plugin3', (args) => {
  console.log('plugin3', args);
});

hook1.call('not');
hook2.call('happy');
hook3.call('work');

// plugin1 not
// plugin2 not
// plugin3 not
// plugin1 happy
// plugin2 happy
// plugin3 happy
// plugin1 work
// plugin2 work
// plugin3 work
