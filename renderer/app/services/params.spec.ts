import { Params } from './params';

import { TestBed } from '@angular/core/testing';

describe('Params', () => {

  let params: Params;

  beforeEach(() => {
    params = TestBed.inject(Params);
    // TODO
    console.log(params);
  });

  test('uuid', () => {
    const uuid1 = Params.uuid;
    const uuid2 = Params.uuid;
    expect(uuid1).toEqual(uuid2);
  });

});
