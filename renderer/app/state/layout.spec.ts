import { Bundle } from './state.spec';
import { LayoutState } from './layout';
import { Params } from '../services/params';

import { prepare } from './state.spec';

describe('LayoutState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.layout.setState({
      [Params.initialLayoutID]: LayoutState.defaultLayout()
    });
  });

  test('makeSplit/closeSplit - vertical', () => {
    const splitID = bundle.layout.snapshot[Params.initialLayoutID].id;
    let layout = bundle.layout.findSplitByID(splitID);
    expect(layout.splits.length).toBe(1);
    bundle.layout.makeSplit({
      splitID,
      ix: 0,
      direction: 'vertical',
      before: true
    });
    layout = bundle.layout.findSplitByID(splitID);
    expect(layout.splits.length).toBe(2);
    expect(layout.splits[0].size).toBe(50);
    expect(layout.splits[1].size).toBe(50);
    const fn = jest.fn();
    bundle.layout.closeSplit({ splitID, ix: 1, visitor: fn });
    layout = bundle.layout.findSplitByID(splitID);
    expect(layout.splits.length).toBe(1);
    expect(layout.splits[0].size).toBe(100);
    expect(fn).toHaveBeenCalled();
  });

  test('makeSplit/closeSplit - horizontal', () => {
    const splitID = bundle.layout.snapshot[Params.initialLayoutID].id;
    let layout = bundle.layout.findSplitByID(splitID);
    expect(layout.splits.length).toBe(1);
    bundle.layout.makeSplit({
      splitID,
      ix: 0,
      direction: 'horizontal',
      before: false
    });
    layout = bundle.layout.findSplitByID(splitID);
    expect(layout.splits.length).toBe(1);
    expect(layout.splits[0].direction).toBe('horizontal');
    expect(layout.splits[0].size).toBe(100);
    expect(layout.splits[0].splits.length).toBe(2);
    expect(layout.splits[0].splits[0].size).toBe(50);
    expect(layout.splits[0].splits[1].size).toBe(50);
    const fn = jest.fn();
    bundle.layout.closeSplit({ splitID, ix: 1, visitor: fn });
    layout = bundle.layout.findSplitByID(splitID);
    expect(layout.splits.length).toBe(1);
    expect(layout.splits[0].size).toBe(100);
    expect(fn).toHaveBeenCalled();
  });

  test('updateSplit', () => {
    const splitID = bundle.layout.snapshot[Params.initialLayoutID].id;
    let layout = bundle.layout.findSplitByID(splitID);
    expect(layout.splits.length).toBe(1);
    bundle.layout.makeSplit({
      splitID,
      ix: 0,
      direction: 'vertical',
      before: true
    });
    layout = bundle.layout.findSplitByID(splitID);
    expect(layout.splits.length).toBe(2);
    expect(layout.splits[0].size).toBe(50);
    expect(layout.splits[1].size).toBe(50);
    bundle.layout.updateSplit({ splitID, sizes: [25, 75] });
    layout = bundle.layout.findSplitByID(splitID);
    expect(layout.splits[0].size).toBe(25);
    expect(layout.splits[1].size).toBe(75);
  });

  test('newLayout/remove', () => {
    expect(bundle.layout.snapshot['x']).toBeFalsy();
    bundle.layout.newLayout({ layoutID: 'x' });
    expect(bundle.layout.snapshot['x']).toBeTruthy();
    const fn = jest.fn();
    bundle.layout.remove({ layoutID: 'x', visitor: fn });
    expect(bundle.layout.snapshot['x']).toBeFalsy();
    expect(fn).toHaveBeenCalled();
  });

  test('findSplitByID', () => {
    const id = bundle.layout.snapshot[Params.initialLayoutID].splits[0].id;
    expect(bundle.layout.findSplitByID(id)).toBeTruthy();
    expect(bundle.layout.findSplitByID('0')).toBeFalsy();
  });

  test('visitSplits', () => {
    const fn = jest.fn();
    bundle.layout.visitSplits(
      bundle.layout.snapshot[Params.initialLayoutID],
      fn
    );
    expect(fn).toHaveBeenCalled();
  });
});
