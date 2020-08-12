import { Params } from '../services/params';
import { SelectionState } from './selection';
import { StorageService } from '../services/storage';
import { Utils } from '../services/utils';

import { scratch } from './operators';

import { Computed } from '@ngxs-labs/data/decorators';
import { DataAction } from '@ngxs-labs/data/decorators';
import { Injectable } from '@angular/core';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Payload } from '@ngxs-labs/data/decorators';
import { Persistence } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';
import { UUID } from 'angular2-uuid';

import { patch } from '@ngxs/store/operators';

interface DataActionParams {
  before?: boolean;
  direction?: SplitDir;
  ix?: number;
  layoutID?: string;
  sizes?: any[];
  splitID?: string;
  visitor?: SplitVisitorFn;
}

export interface Layout {
  direction?: SplitDir;
  id: string;
  root?: boolean;
  size: number;
  splits?: Layout[];
}

export type LayoutStateModel = Record<string, Layout>;

export type SplitDir = 'horizontal' | 'vertical';

export type SplitVisitorFn = (split: Layout) => void;

@Injectable({ providedIn: 'root' })
@Persistence({ path: 'layout', useClass: StorageService })
@StateRepository()
@State<LayoutStateModel>({
  name: 'layout',
  defaults: {
    [Params.initialLayoutID]: LayoutState.defaultLayout()
  }
})
export class LayoutState extends NgxsDataRepository<LayoutStateModel> {
  constructor(private selection: SelectionState, private utils: Utils) {
    super();
  }

  static defaultLayout(): Layout {
    return {
      direction: 'vertical',
      id: UUID.UUID(),
      root: true,
      size: 100,
      splits: [
        {
          id: Params.initialSplitID,
          size: 100
        }
      ]
    };
  }

  // actions

  @DataAction({ insideZone: true })
  closeSplit(
    @Payload('LayoutState.closeSplit')
    { splitID, ix, visitor }: DataActionParams
  ): void {
    const model = this.utils.deepCopy(this.ctx.getState());
    const split = this.findSplitByID(splitID, model);
    if (split) {
      // first, visit the split we're closing
      visitor?.(split.splits[ix]);
      split.splits.splice(ix, 1);
      // if we have more than one split left (or at the root level)
      // we set everyone to the same size, distributed evenly
      if (split.root || split.splits.length > 1) {
        const size = 100 / split.splits.length;
        split.splits.forEach((split) => (split.size = size));
      } else {
        // but if only one split left, collapse the splits
        // NOTE: the root level can't be deleted
        split.id = split.splits[0].id;
        delete split.direction;
        delete split.splits;
      }
      this.ctx.setState(model);
    }
  }

  @DataAction({ insideZone: true })
  makeSplit(
    @Payload('LayoutState.makeSplit')
    { splitID, ix, direction, before, visitor }: DataActionParams
  ): void {
    const model = this.utils.deepCopy(this.ctx.getState());
    const split = this.findSplitByID(splitID, model);
    if (split) {
      // making a split on the same axis is easy
      // we set everyone to the same size, distributed evenly
      if (split.direction === direction) {
        const iy = ix + (before ? 0 : 1);
        split.splits.splice(iy, 0, { id: UUID.UUID(), size: 0 });
        const size = 100 / split.splits.length;
        split.splits.forEach((split) => (split.size = size));
      } else {
        // but now we want to split in the opposite direction
        // we create a new sub-split, preserving IDs
        // we also set everyone to the same size, distributed evenly
        const splat = split.splits[ix];
        splat.direction = direction;
        const splatID = splat.id;
        splat.id = UUID.UUID();
        if (before)
          splat.splits = [
            { id: UUID.UUID(), size: 50 },
            { id: splatID, size: 50 }
          ];
        else
          splat.splits = [
            { id: splatID, size: 50 },
            { id: UUID.UUID(), size: 50 }
          ];
      }
      // visit every split we're adjusting
      this.visitSplits(split, (split) => visitor?.(split));
      this.ctx.setState(model);
    }
  }

  @DataAction({ insideZone: true })
  newLayout(
    @Payload('LayoutState.newLayout') { layoutID, visitor }: DataActionParams
  ): void {
    this.ctx.setState(patch({ [layoutID]: LayoutState.defaultLayout() }));
    const layout = this.ctx.getState()[layoutID];
    this.visitSplits(layout, (split) => visitor?.(split));
  }

  @DataAction({ insideZone: true })
  remove(
    @Payload('LayoutState.remove') { layoutID, visitor }: DataActionParams
  ): void {
    const layout = this.ctx.getState()[layoutID];
    if (layout) {
      // visit every layout we're deleting
      this.visitSplits(layout, (split) => visitor?.(split));
      this.ctx.setState(scratch(layoutID));
    }
  }

  @DataAction({ insideZone: true })
  updateSplit(
    @Payload('LayoutState.updateSplit') { splitID, sizes }: DataActionParams
  ): void {
    const model = this.utils.deepCopy(this.ctx.getState());
    const split = this.findSplitByID(splitID, model);
    if (split) {
      sizes.forEach((size, ix) => (split.splits[ix].size = size));
      this.ctx.setState(model);
    }
  }

  // accessors

  @Computed() get layout(): Layout {
    return this.snapshot[this.selection.layoutID];
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  findSplitByID(id: string, model = this.snapshot): Layout {
    for (const key of Object.keys(model)) {
      const layout = this.findSplitByIDImpl(id, model[key]);
      if (layout) return layout;
    }
    return null;
  }

  findSplitByIDImpl(id: string, layout: Layout): Layout {
    if (layout.id === id) return layout;
    for (const inner of layout.splits ?? []) {
      const split = this.findSplitByIDImpl(id, inner);
      if (split) return split;
    }
    return null;
  }

  visitSplits(layout: Layout, visitor: SplitVisitorFn): void {
    for (const inner of layout.splits ?? []) {
      visitor(inner);
      this.visitSplits(inner, visitor);
    }
  }
}
