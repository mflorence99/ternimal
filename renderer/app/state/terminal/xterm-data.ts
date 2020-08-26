import { Channels } from '../../common';

import { DataAction } from '@ngxs-labs/data/decorators';
import { ElectronService } from 'ngx-electron';
import { Injectable } from '@angular/core';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { NgxsOnInit } from '@ngxs/store';
import { Payload } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';

import { patch } from '@ngxs/store/operators';

interface DataActionParams {
  data?: string;
  splitID?: string;
}

export type TerminalXtermDataStateModel = Record<string, string>;

@Injectable({ providedIn: 'root' })
@StateRepository()
@State<TerminalXtermDataStateModel>({
  name: 'terminalXtermData',
  defaults: {}
})
export class TerminalXtermDataState
  extends NgxsDataRepository<TerminalXtermDataStateModel>
  implements NgxsOnInit {
  //
  constructor(public electron: ElectronService) {
    super();
  }

  // actions

  @DataAction({ insideZone: true })
  consume(
    @Payload('TerminalXtermDataState.consume')
    { splitID }: DataActionParams
  ): void {
    this.ctx.setState(patch({ [splitID]: null }));
  }

  @DataAction({ insideZone: true })
  produce(
    @Payload('TerminalXtermDataState.produce')
    { splitID, data }: DataActionParams
  ): void {
    const state = this.ctx.getState()[splitID];
    this.ctx.setState(patch({ [splitID]: state ? state + data : data }));
  }

  // accessors

  xtermData(splitID: string): string {
    const data = this.snapshot[splitID];
    this.consume({ splitID });
    return data;
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  ngxsOnInit(): void {
    super.ngxsOnInit();
    this.rcvXtermData$();
  }

  // private methods

  private rcvXtermData$(): void {
    this.electron.ipcRenderer.on(
      Channels.xtermFromPty,
      (_, splitID: string, data: string) => {
        this.produce({ splitID, data });
      }
    );
  }
}
