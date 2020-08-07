import { StorageService } from '../../services/storage';
import { Utils } from '../../services/utils';

import { scratch } from '../operators';

import { Actions } from '@ngxs/store';
import { DataAction } from '@ngxs-labs/data/decorators';
import { Injectable } from '@angular/core';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
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
  defaults: { }
})

export class FileSystemPathsState extends NgxsDataRepository<FileSystemPathsStateModel> {

  constructor(private actions$: Actions,
              private utils: Utils) {
    super();
    this.handleActions$();
  }

  // actions

  @DataAction({ insideZone: true })
  close(@Payload('FileSystemPathsState.close') { splitID, path }: DataActionParams): void {
    if (this.ctx.getState()[splitID])
      this.ctx.setState(patch({ [splitID]: removeItem(nm => nm === path) }));
  }

  @DataAction({ insideZone: true })
  open(@Payload('FileSystemPathsState.open') { splitID, path }: DataActionParams): void {
    if (!this.ctx.getState()[splitID])
      this.ctx.setState(patch({ [splitID]: [path] }));
    else if (!this.ctx.getState()[splitID].includes(path))
      this.ctx.setState(patch({ [splitID]: append([path]) }));
  }

  @DataAction({ insideZone: true })
  remove(@Payload('FileSystemPathsState.remove') { splitID }: DataActionParams): void {
    this.ctx.setState(scratch(splitID));
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  isOpen(splitID: string, path: string): boolean {
    return this.snapshot[splitID]?.includes(path);
  }

  // private methods

  private handleActions$(): void {
    this.actions$
      .pipe(
        filter(({ action, status }) => {
          return this.utils.hasProperty(action, 'PanesState.remove')
            && (status === 'SUCCESSFUL');
        })
      )
      .subscribe(({ action }) => {
        const splitID = action['PanesState.remove'].splitID;
        this.remove({ splitID });
      });
  }

}
