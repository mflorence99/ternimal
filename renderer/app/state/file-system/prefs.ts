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

import { filter } from 'rxjs/operators';
import { patch } from '@ngxs/store/operators';

export type DateFmt = 'ago' | 'shortDate' | 'mediumDate' | 'longDate' | 'fullDate';
export type QuantityFmt = 'abbrev' | 'bytes' | 'number';
export type SortOrder = 'alpha' | 'first' | 'last';
export type TimeFmt = 'none' | 'shortTime' | 'mediumTime' | 'longTime' | 'fullTime';

interface DataActionParams {
  layoutID?: string;
  prefs?: FileSystemPrefs;
  splitID?: string;
}

export interface FileSystemPrefs {
  dateFormat: DateFmt;
  quantityFormat: QuantityFmt;
  showGridLines: boolean;
  showHiddenFiles: boolean;
  showOnlyWritableFiles: boolean;
  sortDirectories: SortOrder;
  timeFormat: TimeFmt;
  visibility: Record<string, boolean>;
}

export interface FileSystemPrefsStateModel {
  byLayoutID: Record<string, FileSystemPrefs>;
  bySplitID: Record<string, FileSystemPrefs>;
  global: FileSystemPrefs;
}

@Injectable({ providedIn: 'root' })
@Persistence({ path: 'fileSystemPrefs', useClass: StorageService })
@StateRepository()
@State<FileSystemPrefsStateModel>({
  name: 'fileSystemPrefs',
  defaults: {
    byLayoutID: { },
    bySplitID: { },
    global: FileSystemPrefsState.defaultPrefs()
  }
})

export class FileSystemPrefsState extends NgxsDataRepository<FileSystemPrefsStateModel> {

  constructor(private actions$: Actions,
              private utils: Utils) {
    super();
    this.handleActions$();
  }

  static defaultPrefs(): FileSystemPrefs {
    return {
      dateFormat: 'mediumDate',
      quantityFormat: 'bytes',
      showGridLines: true,
      showHiddenFiles: false,
      showOnlyWritableFiles: false,
      sortDirectories: 'first',
      timeFormat: 'none',
      visibility: {
        mode: true,
        mtime: true,
        name: true,
        size: true
      }
    };
  }

  @DataAction({ insideZone: true })
  remove(@Payload('FileSystemPrefsState.remove') { layoutID, splitID }: DataActionParams): void {
    if (layoutID && !splitID)
      this.ctx.setState(patch({ byLayoutID: scratch(layoutID) }));
    else if (!layoutID && splitID)
      this.ctx.setState(patch({ bySplitID: scratch(splitID) }));
  }

  @DataAction({ insideZone: true })
  update(@Payload('FileSystemPrefsState.update') { layoutID, splitID, prefs }: DataActionParams): void {
    if (!layoutID && !splitID)
      this.ctx.setState(patch({global: prefs }));
    else if (layoutID && !splitID)
      this.ctx.setState(patch({ byLayoutID: patch({ [layoutID]: prefs }) }));
    else if (!layoutID && splitID)
      this.ctx.setState(patch({ bySplitID: patch({ [splitID]: prefs }) }));
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  prefs(layoutID: string, splitID: string): FileSystemPrefs {
    return this.utils.merge(
      this.snapshot.global,
      this.snapshot.byLayoutID[layoutID],
      this.snapshot.bySplitID[splitID],
    );
  }

  // private methods

  private handleActions$(): void {
    this.actions$
      .pipe(
        filter(({ action, status }) => {
          return this.utils.hasProperty(action, /(Layout|Panes)State.remove/)
            && (status === 'SUCCESSFUL');
        })
      )
      .subscribe(({ action }) => {
        const layoutID = action['LayoutState.remove']?.layoutID;
        const splitID = action['PanesState.remove']?.splitID;
        this.remove({ layoutID, splitID });
      }); 
  }

}
