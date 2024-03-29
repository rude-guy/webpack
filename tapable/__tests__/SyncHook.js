/** 第一次编译的结果 */
function fn1(arg1, arg2) {
  'use strict';
  var _context;
  var _x = this._x;
  var _fn0 = _x[0];
  _fn0(arg1, arg2);
  var _fn1 = _x[1];
  _fn1(arg1, arg2);
}
/** 第二次编译的结构 */
function fn2(arg1, arg2) {
  'use strict';
  var _context;
  var _x = this._x;
  var _fn0 = _x[0];
  _fn0(arg1, arg2);
  var _fn1 = _x[1];
  _fn1(arg1, arg2);
  var _fn2 = _x[2];
  _fn2(arg1, arg2);
}
describe('SyncHook', () => {
  const SyncHook = require('../SyncHook');
  it('执行顺序', () => {
    const hooks = new SyncHook(['arg1', 'arg2']);

    const calls = [];

    hooks.tap('1', (arg1, arg2) => {
      calls.push(arg1);
    });

    hooks.tap('2', (arg1, arg2) => {
      calls.push(arg2);
    });

    hooks.call('A', 'B');
    /** */
    expect(calls).toEqual(['A', 'B']);

    calls.length = 0;

    hooks.tap('3', (arg1, arg2) => {
      calls.push(arg1 + arg2);
    });
    hooks.call('A', 'B');
    expect(calls).toEqual(['A', 'B', 'AB']);
  });
});
