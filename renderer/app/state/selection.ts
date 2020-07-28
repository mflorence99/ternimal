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

import { patch } from '@ngxs/store/operators';

interface DataActionParams {
  layoutID?: string;
  splitID?: string;
}

export interface SelectionStateModel {
  layoutID: string;
  splitIDByLayoutID: Record<string, string>;
}

@Injectable({ providedIn: 'root' })
@Persistence({ path: 'selection', useClass: StorageService })
@StateRepository()
@State<SelectionStateModel>({
  name: 'selection',
  defaults: SelectionState.defaultSelection()
})

export class SelectionState extends NgxsDataRepository<SelectionStateModel> {

  static defaultSelection(): SelectionStateModel {
    return {
      layoutID: Params.uuid,
      splitIDByLayoutID: { }
    };
  }

  // actions

  @DataAction({ insideZone: true })
  selectLayout(@Payload('SelectionState.selectLayout') { layoutID }: DataActionParams): void {
    this.ctx.setState(patch({ layoutID }));
  }

  @DataAction({ insideZone: true })
  selectSplit(@Payload('SelectionState.selectLayout') { splitID }: DataActionParams): void {
    this.ctx.setState(patch({ splitIDByLayoutID: patch({ [this.layoutID]: splitID }) }));
  }

  // accessors

  @Computed() get layoutID(): string {
    return this.snapshot.layoutID;
  }

  @Computed() get splitID(): string {
    return this.snapshot.splitIDByLayoutID[this.snapshot.layoutID];
  }

}
