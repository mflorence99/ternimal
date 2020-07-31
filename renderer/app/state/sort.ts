import { StorageService } from '../services/storage';

import { scratch } from './operators';

import { DataAction } from '@ngxs-labs/data/decorators';
import { Injectable } from '@angular/core';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Payload } from '@ngxs-labs/data/decorators';
import { Persistence } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';

import { patch } from '@ngxs/store/operators';

export interface ColumnSort {
  sortDir: number;
  sortedColumn?: number;
  sortedID?: string;
}

interface DataActionParams {
  columnSort?: ColumnSort;
  splitID?: string;
}

export type SortStateModel = Record<string, ColumnSort>;

@Injectable({ providedIn: 'root' })
@Persistence({ path: 'sort', useClass: StorageService })
@StateRepository()
@State<SortStateModel>({
  name: 'sort',
  defaults: { }
})

export class SortState extends NgxsDataRepository<SortStateModel> {

  // actions

  @DataAction({ insideZone: true })
  removeSort(@Payload('SortState.removeSort') { splitID }: DataActionParams): void {
    this.ctx.setState(scratch(splitID));
  }

  @DataAction({ insideZone: true })
  updateSort(@Payload('SortState.updateSort') { splitID, columnSort}: DataActionParams): void {
    this.ctx.setState(patch({ [splitID]: columnSort }));
  }

}
