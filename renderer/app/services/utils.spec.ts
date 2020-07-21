import { Utils } from './utils';

import { TestBed } from '@angular/core/testing';

describe('Utils', () => {

  let utils: Utils;

  beforeEach(() => {
    utils = TestBed.inject(Utils);
  });

  test('Object can be deep copied', () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = utils.deepCopy(obj1);
    expect(obj1.b.c).toEqual(obj2.b.c);
  });

  test('nextTick works asynchronously', done => {
    const num = 42;
    utils.nextTick(() => {
      expect(num).toEqual(42);
      done();
    });
  });

});
