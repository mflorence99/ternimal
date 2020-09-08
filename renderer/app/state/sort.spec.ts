import { Bundle } from './state.spec';
import { SortState } from './sort';
import { SortStateModel } from './sort';

import { prepare } from './state.spec';

const state: SortStateModel = {
  a: {
    at1: {
      sortDir: 1,
      sortedColumn: 0,
      sortedID: 'as1'
    },
    at2: {
      sortDir: 1,
      sortedColumn: 0,
      sortedID: 'as2'
    }
  },
  b: {
    bt1: {
      sortDir: 1,
      sortedColumn: 0,
      sortedID: 'bs1'
    }
  }
};

describe('SortState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.sort.setState(state);
  });

  test('remove', () => {
    bundle.sort.remove({ splitID: 'b' });
    expect(bundle.sort.snapshot).toEqual({
      a: {
        at1: {
          sortDir: 1,
          sortedColumn: 0,
          sortedID: 'as1'
        },
        at2: {
          sortDir: 1,
          sortedColumn: 0,
          sortedID: 'as2'
        }
      }
    });
  });

  test('update - create new split', () => {
    bundle.sort.update({
      splitID: 'c',
      tableID: 'ct1',
      columnSort: {
        sortDir: 1,
        sortedColumn: 0,
        sortedID: 'cs1'
      }
    });
    expect(bundle.sort.snapshot).toEqual({
      a: {
        at1: {
          sortDir: 1,
          sortedColumn: 0,
          sortedID: 'as1'
        },
        at2: {
          sortDir: 1,
          sortedColumn: 0,
          sortedID: 'as2'
        }
      },
      b: {
        bt1: {
          sortDir: 1,
          sortedColumn: 0,
          sortedID: 'bs1'
        }
      },
      c: {
        ct1: {
          sortDir: 1,
          sortedColumn: 0,
          sortedID: 'cs1'
        }
      }
    });
  });

  test('update - create new table', () => {
    bundle.sort.update({
      splitID: 'b',
      tableID: 'bt2',
      columnSort: {
        sortDir: 1,
        sortedColumn: 0,
        sortedID: 'bs2'
      }
    });
    expect(bundle.sort.snapshot).toEqual({
      a: {
        at1: {
          sortDir: 1,
          sortedColumn: 0,
          sortedID: 'as1'
        },
        at2: {
          sortDir: 1,
          sortedColumn: 0,
          sortedID: 'as2'
        }
      },
      b: {
        bt1: {
          sortDir: 1,
          sortedColumn: 0,
          sortedID: 'bs1'
        },
        bt2: {
          sortDir: 1,
          sortedColumn: 0,
          sortedID: 'bs2'
        }
      }
    });
  });

  test('update - update existing sort', () => {
    bundle.sort.update({
      splitID: 'b',
      tableID: 'bt1',
      columnSort: {
        sortDir: 1,
        sortedColumn: 0,
        sortedID: 'bs2'
      }
    });
    expect(bundle.sort.snapshot).toEqual({
      a: {
        at1: {
          sortDir: 1,
          sortedColumn: 0,
          sortedID: 'as1'
        },
        at2: {
          sortDir: 1,
          sortedColumn: 0,
          sortedID: 'as2'
        }
      },
      b: {
        bt1: {
          sortDir: 1,
          sortedColumn: 0,
          sortedID: 'bs2'
        }
      }
    });
  });

  test('columnSort', () => {
    expect(bundle.sort.columnSort('b', 'bt1')).toEqual({
      sortDir: 1,
      sortedColumn: 0,
      sortedID: 'bs1'
    });
  });

  test('columnSort - not found', () => {
    expect(bundle.sort.columnSort('x', 'xxx')).toEqual(SortState.defaultSort());
  });
});
