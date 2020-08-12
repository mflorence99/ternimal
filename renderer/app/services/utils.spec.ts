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

  test('hasProperty can test for a string', () => {
    const obj = { a: 1, b: { c: 2 } };
    expect(utils.hasProperty(obj, 'a')).toBe(true);
    expect(utils.hasProperty(obj, 'c')).toBe(false);
  });

  test('hasProperty can test for a regexp', () => {
    const obj = { alpha: 1, aLPHA: { gamma: 2 } };
    expect(utils.hasProperty(obj, /^[a-z]*$/)).toBe(true);
    expect(utils.hasProperty(obj, /^[A-Z]*$/)).toBe(false);
  });

  test('Objects can be merged, respecting null values', () => {
    const obj1 = { a: 1, b: null, c: 'c', d: { p: true, q: false } };
    const obj2 = { a: null, b: true, c: 2, d: { p: null, q: true } };
    const target = { a: 1, b: true, c: 2, d: { p: true, q: true } };
    expect(utils.merge(obj1, obj2)).toEqual(target);
  });

  test('nextTick works asynchronously', (done) => {
    const num = 42;
    utils.nextTick(() => {
      expect(num).toEqual(42);
      done();
    });
  });
});
