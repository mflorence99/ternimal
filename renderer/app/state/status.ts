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

interface DataActionParams {
  splitID?: string;
  status?: Status;
}

export interface Status {
  cwd?: string;
}

export type StatusStateModel = Record<string, Status>;

@Injectable({ providedIn: 'root' })
@Persistence({ path: 'status', useClass: StorageService })
@StateRepository()
@State<StatusStateModel>({
  name: 'status',
  defaults: { }
})

export class StatusState extends NgxsDataRepository<StatusStateModel> {

  // actions

  @DataAction({ insideZone: true })
  remove(@Payload('StatusState.remove') { splitID }: DataActionParams): void {
    this.ctx.setState(scratch(splitID));
  }

  @DataAction({ insideZone: true })
  update(@Payload('StatusState.update') { splitID, status }: DataActionParams): void {
    this.ctx.setState(patch({ [splitID]: status }));
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  status(splitID: string): Status {
    return this.snapshot[splitID] ?? { };
  }

}
