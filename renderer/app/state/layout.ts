import { Params } from '../services/params';
import { StorageService } from '../services/storage';

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

export type SplitDir = 'horizontal' | 'vertical';

export interface Layout {
  direction?: SplitDir;
  id: string;
  root?: boolean;
  size: number;
  splits?: Layout[];
}

export interface LayoutStateModel {
  [id: string]: Layout;
}

@Injectable({ providedIn: 'root' })
  @Persistence({ useClass: StorageService })
@StateRepository()
@State<LayoutStateModel>({
  name: 'layout',
  defaults: {
    // NOTE: this is the well-known ID of the "permanent" tab
    [Params.uuid]: LayoutState.defaultLayout()
  }
}) export class LayoutState extends NgxsDataRepository<LayoutStateModel> {

  /** Create the default layout */
  static defaultLayout(): Layout {
    return {
      direction: 'vertical',
      id: UUID.UUID(),
      root: true,
      size: 100,
      splits: [
        {
          id: UUID.UUID(),
          size: 100
        }
      ]
    };
  }

  // actions

  // accessors

  // public methods

  findSplitByID(id: string): Layout {
    for (const key of Object.keys(this.snapshot)) {
      if (key === id)
        return this.snapshot[key];
      else {
        const layout = this.findSplitByIDImpl(this.snapshot[key], id);
        if (layout)
          return layout;
      }
    }
    return null;
  }

  /** Deep find a layout by its ID */
  findSplitByIDImpl(layout: Layout, id: string): Layout {
    if (layout.id === id)
      return layout;
    if (layout.splits && layout.splits.length) {
      for (const inner of layout.splits) {
        const split = this.findSplitByIDImpl(inner, id);
        if (split)
          return split;
      }
    }
    return null;
  }

}
