import { Channels } from '../../common';
import { StorageService } from '../../services/storage';
import { Utils } from '../../services/utils';

import { scratch } from '../operators';

import { Actions } from '@ngxs/store';
import { DataAction } from '@ngxs-labs/data/decorators';
import { ElectronService } from 'ngx-electron';
import { Injectable } from '@angular/core';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { NgxsOnInit } from '@ngxs/store';
import { Payload } from '@ngxs-labs/data/decorators';
import { Persistence } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';

import { append } from '@ngxs/store/operators';
import { filter } from 'rxjs/operators';
import { patch } from '@ngxs/store/operators';
import { removeItem } from '@ngxs/store/operators';

interface DataActionParams {
  path?: string;
  splitID?: string;
}

export type FileSystemPathsStateModel = Record<string, string[]>;

@Injectable({ providedIn: 'root' })
@Persistence({ path: 'fileSystemPaths', useClass: StorageService })
@StateRepository()
@State<FileSystemPathsStateModel>({
  name: 'fileSystemPaths',
  defaults: {}
})
export class FileSystemPathsState
  extends NgxsDataRepository<FileSystemPathsStateModel>
  implements NgxsOnInit {
  //
  constructor(
    public actions$: Actions,
    public electron: ElectronService,
    private utils: Utils
  ) {
    super();
  }

  // actions

  @DataAction({ insideZone: true })
  close(
    @Payload('FileSystemPathsState.close') { splitID, path }: DataActionParams
  ): void {
    if (this.ctx.getState()[splitID])
      this.ctx.setState(patch({ [splitID]: removeItem((nm) => nm === path) }));
  }

  @DataAction({ insideZone: true })
  open(
    @Payload('FileSystemPathsState.open') { splitID, path }: DataActionParams
  ): void {
    if (!this.ctx.getState()[splitID])
      this.ctx.setState(patch({ [splitID]: [path] }));
    else if (!this.ctx.getState()[splitID].includes(path))
      this.ctx.setState(patch({ [splitID]: append([path]) }));
  }

  @DataAction({ insideZone: true })
  remove(
    @Payload('FileSystemPathsState.remove') { splitID }: DataActionParams
  ): void {
    this.ctx.setState(scratch(splitID));
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  isOpen(splitID: string, path: string): boolean {
    return !!this.snapshot[splitID]?.includes(path);
  }

  ngxsOnInit(): void {
    super.ngxsOnInit();
    this.handleActions$();
    this.rcvPath$();
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
      });
  }

  private rcvPath$(): void {
    this.electron.ipcRenderer.on(
      Channels.fsLoadPathFailure,
      (_, path: string) => {
        const splitIDs = Object.keys(this.snapshot);
        splitIDs.forEach((splitID) => this.close({ splitID, path }));
      }
    );
  }
}
