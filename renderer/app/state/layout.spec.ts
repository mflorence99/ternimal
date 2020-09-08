import { Bundle } from './state.spec';
import { Layout } from './layout';
import { Params } from '../services/params';

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
    bundle.selection.selectLayout({ layoutID: 'a' });
  });

  test('makeSplit/closeSplit - vertical - before (aka up)', () => {
    bundle.layout.makeSplit({
      splitID: 'a.b',
      ix: 0,
      direction: 'vertical',
      before: true,
      visitor: jest.fn()
    });
    expect(bundle.layout.layout).toEqual(
      expect.objectContaining({
        direction: 'vertical',
        id: 'a.b',
        root: true,
        size: 100,
        splits: [
          {
            id: expect.any(String),
            size: 33.333333333333336
          },
          {
            id: 'a.b.1',
            size: 33.333333333333336
          },
          {
            id: 'a.b.2',
            size: 33.333333333333336,
            direction: 'horizontal',
            splits: [
              { id: 'a.b.2.i', size: 50 },
              { id: 'a.b.2.ii', size: 50 }
            ]
          }
        ]
      })
    );
    // now close the new split and we're back where we started
    bundle.layout.closeSplit({ splitID: 'a.b', ix: 0, visitor: jest.fn() });
    expect(bundle.layout.layout).toEqual(state.a);
  });

  test('makeSplit/closeSplit - vertical - after (aka down)', () => {
    bundle.layout.makeSplit({
      splitID: 'a.b',
      ix: 0,
      direction: 'vertical',
      before: false,
      visitor: jest.fn()
    });
    expect(bundle.layout.layout).toEqual(
      expect.objectContaining({
        direction: 'vertical',
        id: 'a.b',
        root: true,
        size: 100,
        splits: [
          {
            id: 'a.b.1',
            size: 33.333333333333336
          },
          {
            id: expect.any(String),
            size: 33.333333333333336
          },
          {
            id: 'a.b.2',
            size: 33.333333333333336,
            direction: 'horizontal',
            splits: [
              { id: 'a.b.2.i', size: 50 },
              { id: 'a.b.2.ii', size: 50 }
            ]
          }
        ]
      })
    );
    // now close the new split and we're back where we started
    bundle.layout.closeSplit({ splitID: 'a.b', ix: 1, visitor: jest.fn() });
    expect(bundle.layout.layout).toEqual(state.a);
  });

  test('makeSplit/closeSplit - horizontal - before (aka left)', () => {
    bundle.layout.makeSplit({
      splitID: 'a.b',
      ix: 0,
      direction: 'horizontal',
      before: true,
      visitor: jest.fn()
    });
    expect(bundle.layout.layout).toEqual(
      expect.objectContaining({
        direction: 'vertical',
        id: 'a.b',
        root: true,
        size: 100,
        splits: [
          {
            id: expect.any(String),
            size: 50,
            direction: 'horizontal',
            splits: [
              { id: expect.any(String), size: 50 },
              { id: 'a.b.1', size: 50 }
            ]
          },
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
      })
    );
    // now close the new split and we're back where we started
    const splitID = bundle.layout.layout.splits[0].id;
    bundle.layout.closeSplit({ splitID, ix: 0, visitor: jest.fn() });
    expect(bundle.layout.layout).toEqual(state.a);
  });

  test('makeSplit/closeSplit - horizontal - after (aka right)', () => {
    bundle.layout.makeSplit({
      splitID: 'a.b',
      ix: 0,
      direction: 'horizontal',
      before: false,
      visitor: jest.fn()
    });
    expect(bundle.layout.layout).toEqual(
      expect.objectContaining({
        direction: 'vertical',
        id: 'a.b',
        root: true,
        size: 100,
        splits: [
          {
            id: expect.any(String),
            size: 50,
            direction: 'horizontal',
            splits: [
              { id: 'a.b.1', size: 50 },
              { id: expect.any(String), size: 50 }
            ]
          },
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
      })
    );
    // now close the new split and we're back where we started
    const splitID = bundle.layout.layout.splits[0].id;
    bundle.layout.closeSplit({ splitID, ix: 1, visitor: jest.fn() });
    expect(bundle.layout.layout).toEqual(state.a);
  });

  test('updateSplit', () => {
    bundle.layout.updateSplit({ splitID: 'a.b.2', sizes: [25, 75] });
    const split = bundle.layout.findSplitByID('a.b.2');
    expect(split).toEqual({
      id: 'a.b.2',
      size: 50,
      direction: 'horizontal',
      splits: [
        { id: 'a.b.2.i', size: 25 },
        { id: 'a.b.2.ii', size: 75 }
      ]
    });
  });

  test('newLayout/remove', () => {
    bundle.layout.newLayout({ layoutID: 'b', visitor: jest.fn() });
    expect(Object.keys(bundle.layout.snapshot)).toEqual(['a', 'b']);
    expect(bundle.layout.snapshot['b']).toEqual(
      expect.objectContaining({
        direction: 'vertical',
        id: expect.any(String),
        root: true,
        size: 100,
        splits: [
          {
            id: Params.initialSplitID,
            size: 100
          }
        ]
      })
    );
    // now remove the new layout
    bundle.layout.remove({ layoutID: 'b', visitor: jest.fn() });
    expect(Object.keys(bundle.layout.snapshot)).toEqual(['a']);
  });

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

  test('findSplitByID - not found', () => {
    const split = bundle.layout.findSplitByID('does not exist');
    expect(split).toBeNil();
  });

  test('layout -- from selection', () => {
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
