import { MockElementRef } from '../../__mocks__/element-ref';
import { Utils } from './utils';

import 'jest-extended';

import { TestBed } from '@angular/core/testing';

describe('Utils', () => {
  let utils: Utils;

  beforeEach(() => {
    utils = TestBed.inject(Utils);
  });

  test('colorOf', () => {
    const element = new MockElementRef();
    expect(utils.colorOf(element, 'var(--may-grey-900)', 0)).toBe(
      'rgba(0, 0, 0, 0)'
    );
    expect(utils.colorOf(element, 'var(--may-grey-900)', 1)).toBe('#123456');
    expect(utils.colorOf(element, 'var(--may-grey-900)', 0.5)).toBe(
      '#12345680'
    );
  });

  test('deepCopy', () => {
    const obj1 = { a: 1, b: { c: 2 } };
    const obj2 = utils.deepCopy(obj1);
    expect(obj1.b.c).toEqual(obj2.b.c);
  });

  test('hasProperty (string)', () => {
    const obj = { a: 1, b: { c: 2 } };
    expect(utils.hasProperty(obj, 'a')).toBeTrue();
    expect(utils.hasProperty(obj, 'c')).toBeFalse();
  });

  test('hasProperty (regex)', () => {
    const obj = { alpha: 1, aLPHA: { gamma: 2 } };
    expect(utils.hasProperty(obj, /^[a-z]*$/)).toBeTrue();
    expect(utils.hasProperty(obj, /^[A-Z]*$/)).toBeFalse();
  });

  test('merge', () => {
    const obj1 = { a: 1, b: null, c: 'c', d: { p: true, q: false } };
    const obj2 = { a: null, b: true, c: 2, d: { p: null, q: true } };
    const target = { a: 1, b: true, c: 2, d: { p: true, q: true } };
    expect(utils.merge(obj1, obj2)).toEqual(target);
  });

  test('nextTick', (done) => {
    const num = 42;
    utils.nextTick(() => {
      expect(num).toEqual(42);
      done();
    });
  });
});
