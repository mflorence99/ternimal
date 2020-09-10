import { Channels } from '../../common';
import { StatusState } from '../../state/status';
import { TerminalPrefsState } from '../../state/terminal/prefs';
import { Utils } from '../../services/utils';

import { scratch } from '../operators';

import { Actions } from '@ngxs/store';
import { DataAction } from '@ngxs-labs/data/decorators';
import { ElectronService } from 'ngx-electron';
import { Injectable } from '@angular/core';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { NgxsOnInit } from '@ngxs/store';
import { Payload } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';

import { filter } from 'rxjs/operators';
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
  constructor(
    public actions$: Actions,
    public electron: ElectronService,
    public prefs: TerminalPrefsState,
    public status: StatusState,
    private utils: Utils
  ) {
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

  @DataAction({ insideZone: true })
  remove(
    @Payload('TerminalXtermDataState.remove') { splitID }: DataActionParams
  ): void {
    this.ctx.setState(scratch(splitID));
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
    this.handleActions$();
    this.rcvXtermCWD$();
    this.rcvXtermData$();
  }

  // private methods

  // NOTE: why do this here, rather than in the coordinated remove in
  // Tabs and PanesComponent? Because neither of those high-level components
  // "know" anything about the file-system widget
  private handleActions$(): void {
    this.actions$
      .pipe(
        filter(({ action, status }) => {
          return (
            this.utils.hasProperty(action, 'PanesState.remove') &&
            status === 'SUCCESSFUL'
          );
        })
      )
      .subscribe(({ action }) => {
        const splitID = action['PanesState.remove'].splitID;
        this.remove({ splitID });
        // convenient to kill the pty process here
        this.electron.ipcRenderer.send(Channels.xtermKill, splitID);
      });
  }

  private rcvXtermCWD$(): void {
    this.electron.ipcRenderer.on(
      Channels.xtermCWD,
      (_, splitID: string, cwd: string) => {
        this.prefs.update({ splitID: splitID, prefs: { root: cwd } });
        this.status.update({
          splitID: splitID,
          widgetID: 'TerminalComponent',
          status: { cwd: cwd }
        });
      }
    );
  }

  private rcvXtermData$(): void {
    this.electron.ipcRenderer.on(
      Channels.xtermFromPty,
      (_, splitID: string, data: string) => {
        this.produce({ splitID, data });
      }
    );
  }
}
