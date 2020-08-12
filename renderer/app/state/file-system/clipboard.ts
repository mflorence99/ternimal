import { Channels } from '../../common/channels';
import { Utils } from '../../services/utils';

import { Actions } from '@ngxs/store';
import { Computed } from '@ngxs-labs/data/decorators';
import { DataAction } from '@ngxs-labs/data/decorators';
import { ElectronService } from 'ngx-electron';
import { Injectable } from '@angular/core';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { NgxsOnInit } from '@ngxs/store';
import { Payload } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';

import { filter } from 'rxjs/operators';

interface DataActionParams {
  op: ClipboardOp;
  paths: string[];
}

export type ClipboardOp = 'clear' | 'copy' | 'cut';

export interface FileSystemClipboardStateModel {
  op: ClipboardOp;
  paths: string[];
}

@Injectable({ providedIn: 'root' })
@StateRepository()
@State<FileSystemClipboardStateModel>({
  name: 'fileSystemClipboard',
  defaults: FileSystemClipboardState.defaultState()
})
export class FileSystemClipboardState
  extends NgxsDataRepository<FileSystemClipboardStateModel>
  implements NgxsOnInit {
  constructor(
    private actions$: Actions,
    public electron: ElectronService,
    private utils: Utils
  ) {
    super();
  }

  static defaultState(): FileSystemClipboardStateModel {
    return {
      op: 'clear',
      paths: []
    };
  }

  // actions

  @DataAction({ insideZone: true })
  update(
    @Payload('FileSystemClipboardState.update') { op, paths }: DataActionParams
  ): void {
    this.ctx.setState({ op, paths });
  }

  // accessors

  @Computed() get op(): ClipboardOp {
    return this.snapshot.op;
  }

  @Computed() get paths(): string[] {
    return this.snapshot.paths;
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  ngxsOnInit(): void {
    super.ngxsOnInit();
    this.handleActions$();
  }

  private handleActions$(): void {
    this.actions$
      .pipe(
        filter(({ action, status }) => {
          return (
            this.utils.hasProperty(action, /FileSystemFilesState/) &&
            status === 'SUCCESSFUL'
          );
        })
      )
      .subscribe(() => this.validate());
  }

  private validate(): void {
    const state = this.snapshot;
    let delta = false;
    // find paths that still exists
    const paths = state.paths.reduce((acc, path) => {
      if (this.electron.ipcRenderer.sendSync(Channels.fsExists, path))
        acc.push(path);
      else delta = true;
      return acc;
    }, []);
    // if that changed, reset clipboard
    if (delta) {
      const op = paths.length > 0 ? state.op : 'clear';
      this.update({ op, paths });
    }
  }
}
