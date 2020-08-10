import { Params } from '../services/params';
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
  widgetID?: string;
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

  static defaultStatus(): Status {
    return {
      cwd: Params.homeDir
    };
  }

  // actions

  @DataAction({ insideZone: true })
  remove(@Payload('StatusState.remove') { splitID }: DataActionParams): void {
    this.ctx.setState(scratch(splitID));
  }

  @DataAction({ insideZone: true })
  update(@Payload('StatusState.update') { splitID, widgetID, status }: DataActionParams): void {
    if (!this.ctx.getState()[splitID])
      this.ctx.setState(patch({ [splitID]: {} }));
    this.ctx.setState(patch({ [splitID]: patch({ [widgetID]: status }) }));
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  status(splitID: string, widgetID: string): Status {
    return this.snapshot[splitID]?.[widgetID] ?? StatusState.defaultStatus();
  }

}
