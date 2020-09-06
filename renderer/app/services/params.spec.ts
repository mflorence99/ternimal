import { Params } from './params';

import { TestBed } from '@angular/core/testing';

describe('Params', () => {
  let params: Params;

  beforeEach(() => {
    params = TestBed.inject(Params);
  });

  test('log', () => {
    expect(params.log.colorize('red')).toContain('red');
  });

  test('uuid', () => {
    const uuid1 = Params.initialLayoutID;
    const uuid2 = Params.initialLayoutID;
    expect(uuid1).toEqual(uuid2);
  });
});
