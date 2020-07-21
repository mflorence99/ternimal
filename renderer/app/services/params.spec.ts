import { Params } from './params';

import { TestBed } from '@angular/core/testing';

describe('Params', () => {

  let params: Params;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params = TestBed.inject(Params);
  });

  test('uuid', () => {
    const uuid1 = Params.uuid;
    const uuid2 = Params.uuid;
    expect(uuid1).toEqual(uuid2);
  });

});
