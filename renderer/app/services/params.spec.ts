import { Params } from './params';

import { TestBed } from '@angular/core/testing';

describe('Params', () => {

  let params: Params;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params = TestBed.inject(Params);
  });

  test('uuid', () => {
    const uuid1 = Params.initialLayoutID;
    const uuid2 = Params.initialLayoutID;
    expect(uuid1).toEqual(uuid2);
  });

});
