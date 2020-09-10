import { Channels } from '../../common';
import { FileDescriptor } from '../../common';
import { Params } from '../../services/params';

import { scratch } from '../operators';

import { DataAction } from '@ngxs-labs/data/decorators';
import { ElectronService } from 'ngx-electron';
import { Injectable } from '@angular/core';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { NgxsOnInit } from '@ngxs/store';
import { Payload } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';
import { Subject } from 'rxjs';

import { patch } from '@ngxs/store/operators';

interface DataActionParams {
  descs?: FileDescriptor[];
  path?: string;
}

export interface FileSystemFilesStateModel {
  [path: string]: FileDescriptor[];
}

@Injectable({ providedIn: 'root' })
@StateRepository()
@State<FileSystemFilesStateModel>({
  name: 'fileSystemFiles',
  defaults: {}
})
export class FileSystemFilesState
  extends NgxsDataRepository<FileSystemFilesStateModel>
  implements NgxsOnInit {
  loading$ = new Subject<Record<string, boolean>>();

  constructor(public electron: ElectronService) {
    super();
  }

  // actions

  @DataAction({ insideZone: true })
  loadPath(
    @Payload('FileSystemFilesState.loadPath') { path, descs }: DataActionParams
  ): void {
    this.ctx.setState(patch({ [path]: descs }));
  }

  @DataAction({ insideZone: true })
  unloadPath(
    @Payload('FileSystemFilesState.unloadPath') { path }: DataActionParams
  ): void {
    this.ctx.setState(scratch(path));
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  descsForPaths(paths: string[]): FileDescriptor[] {
    const result = [];
    const descsByPath: Record<string, FileDescriptor> = {};
    paths.forEach((path) => {
      if (descsByPath[path]) result.push(descsByPath[path]);
      else {
        const ix = path.lastIndexOf(Params.pathSeparator);
        let root = path.substring(0, ix);
        if (root.length === 0) root = Params.rootDir;
        const descs = this.snapshot[root] ?? [];
        descs.forEach((desc) => (descsByPath[desc.path] = desc));
        if (descsByPath[path]) result.push(descsByPath[path]);
      }
    });
    return result;
  }

  loadPaths(paths: string[]): void {
    paths.forEach((path) => {
      if (!this.snapshot[path]) {
        this.loading$.next({ [path]: true });
        this.electron.ipcRenderer.send(Channels.fsLoadPathRequest, path);
      }
    });
  }

  ngxsOnInit(): void {
    super.ngxsOnInit();
    this.rcvPath$();
  }

  // private methods

  private rcvPath$(): void {
    this.electron.ipcRenderer.on(
      Channels.fsLoadPathSuccess,
      (_, path: string, descs: FileDescriptor[]) => {
        this.loadPath({ path, descs });
        this.loading$.next({ [path]: false });
      }
    );
    this.electron.ipcRenderer.on(
      Channels.fsLoadPathFailure,
      (_, path: string) => {
        this.unloadPath({ path });
        this.loading$.next({ [path]: false });
      }
    );
  }
}
