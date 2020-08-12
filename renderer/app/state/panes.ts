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
  prefs?: PanePrefs;
  splitID?: string;
}

export interface PanePrefs {
  widget: string;
}

export type PanesStateModel = Record<string, PanePrefs>;

@Injectable({ providedIn: 'root' })
@Persistence({ path: 'panes', useClass: StorageService })
@StateRepository()
@State<PanesStateModel>({
  name: 'panes',
  defaults: {}
})
export class PanesState extends NgxsDataRepository<PanesStateModel> {
  static defaultPrefs(): PanePrefs {
    return {
      widget: 'TerminalComponent'
    };
  }

  // actions

  @DataAction({ insideZone: true })
  remove(@Payload('PanesState.remove') { splitID }: DataActionParams): void {
    this.ctx.setState(scratch(splitID));
  }

  @DataAction({ insideZone: true })
  update(
    @Payload('PanesState.update') { splitID, prefs }: DataActionParams
  ): void {
    this.ctx.setState(patch({ [splitID]: prefs }));
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  prefs(splitID: string): PanePrefs {
    return this.snapshot[splitID] ?? PanesState.defaultPrefs();
  }
}
