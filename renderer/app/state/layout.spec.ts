import { Bundle } from './state.spec';
import { Layout } from './layout';

import { prepare } from './state.spec';

import 'jest-extended';

const state: Record<string, Layout> = {
  a: {
    direction: 'vertical',
    id: 'a.b',
    root: true,
    size: 100,
    splits: [
      { id: 'a.b.1', size: 50 },
      {
        id: 'a.b.2',
        size: 50,
        direction: 'horizontal',
        splits: [
          { id: 'a.b.2.i', size: 50 },
          { id: 'a.b.2.ii', size: 50 }
        ]
      }
    ]
  }
};

describe('LayoutState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.layout.setState(state);
  });

  test('makeSplit/closeSplit - vertical - before', () => {});

  test('makeSplit/closeSplit - vertical - after', () => {});

  test('makeSplit/closeSplit - horizontal - before', () => {});

  test('makeSplit/closeSplit - horizontal - after', () => {});

  test('makeSplit/closeSplit - collapse splits', () => {});

  test('updateSplit', () => {});

  test('newLayout/remove', () => {});

  test('findSplitByID', () => {
    const split = bundle.layout.findSplitByID('a.b.2');
    expect(split).toEqual({
      id: 'a.b.2',
      size: 50,
      direction: 'horizontal',
      splits: [
        { id: 'a.b.2.i', size: 50 },
        { id: 'a.b.2.ii', size: 50 }
      ]
    });
  });

  test('layout -- from selection', () => {
    bundle.selection.selectLayout({ layoutID: 'a' });
    expect(bundle.layout.layout).toEqual(state.a);
  });

  test('everySplit', () => {
    const split = bundle.layout.findSplitByID('a.b.2');
    expect(
      bundle.layout.everySplit(split, (splat) => splat.size === 50)
    ).toBeTrue();
  });

  test('someSplit', () => {
    const split = bundle.layout.findSplitByID('a.b.2');
    expect(
      bundle.layout.someSplit(split, (splat) => splat.id === 'a.b.2.ii')
    ).toBeTrue();
  });

  test('visitSplits', () => {
    const visitor = jest.fn();
    bundle.selection.selectLayout({ layoutID: 'a' });
    bundle.layout.visitSplits(bundle.layout.layout, visitor);
    expect(visitor).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        id: 'a.b.1',
        size: 50
      })
    );
    expect(visitor).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        direction: 'horizontal',
        id: 'a.b.2',
        size: 50
      })
    );
    expect(visitor).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        id: 'a.b.2.i',
        size: 50
      })
    );
    expect(visitor).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        id: 'a.b.2.ii',
        size: 50
      })
    );
  });
});
