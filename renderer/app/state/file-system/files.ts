import { Channels } from '../../common/channels';
import { FileDescriptor } from '../../common/file-system';

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
  defaults: { }
})

export class FileSystemFilesState extends NgxsDataRepository<FileSystemFilesStateModel> implements NgxsOnInit {

  loading$ = new Subject<Record<string, boolean>>();

  constructor(private electron: ElectronService) { 
    super();
  }

  // actions

  @DataAction({ insideZone: true })
  loadPath(@Payload('FileSystemFilesState.loadPath') { path, descs }: DataActionParams): void {
    this.ctx.setState(patch({ [path]: descs }));
  }

  @DataAction({ insideZone: true })
  unloadPath(@Payload('FileSystemFilesState.unloadPath') { path }: DataActionParams): void {
    this.ctx.setState(scratch(path));
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  loadPaths(paths: string[]): void {
    paths.forEach(path => {
      if (!this.snapshot[path]) {
        this.loading$.next(paths.reduce((acc, path) => {
          acc[path] = true;
          return acc;
        }, { }));
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
    this.electron.ipcRenderer
      .on(Channels.fsLoadPathSuccess, (_, path: string, descs: FileDescriptor[]) => {
        this.loadPath({ path, descs });
        this.loading$.next({ [path]: false });
      });
    this.electron.ipcRenderer
      .on(Channels.fsLoadPathFailure, (_, path: string) => {
        this.unloadPath({ path });
        this.loading$.next({ [path]: false });
      });
    // TODO: what about fsWatcherFailure ???
  }

}
