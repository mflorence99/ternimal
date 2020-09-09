import { Params } from './params';

import 'jest-extended';

import { TestBed } from '@angular/core/testing';

describe('Params', () => {
  let params: Params;

  beforeEach(() => {
    params = TestBed.inject(Params);
  });

  test('static homeDir', () => {
    expect(Params.homeDir).toBe('/home/mflo');
  });

  test('static pathSeparator', () => {
    expect(Params.pathSeparator).toBe('/');
  });

  test('static rootDir', () => {
    expect(Params.rootDir).toBe('/');
  });

  test('static uuid', () => {
    const uuid1 = Params.initialLayoutID;
    const uuid2 = Params.initialLayoutID;
    expect(uuid1).toBe(uuid2);
  });

  test('log', () => {
    expect(params.log.colorize('red')).toContain('red');
  });
});
