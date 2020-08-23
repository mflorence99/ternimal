import { Dictionary } from '../prefs';
import { Params } from '../../services/params';
import { PrefsState } from '../prefs';
import { SelectionState } from '../../state/selection';
import { StorageService } from '../../services/storage';
import { Utils } from '../../services/utils';

import { Actions } from '@ngxs/store';
import { Computed } from '@ngxs-labs/data/decorators';
import { Injectable } from '@angular/core';
import { NgxsOnInit } from '@ngxs/store';
import { Persistence } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';

export type DateFmt =
  | 'ago'
  | 'shortDate'
  | 'mediumDate'
  | 'longDate'
  | 'fullDate';

export type QuantityFmt = 'abbrev' | 'bytes' | 'number';
export type SortOrder = 'alpha' | 'first' | 'last';
export type TimeFmt =
  | 'none'
  | 'shortTime'
  | 'mediumTime'
  | 'longTime'
  | 'fullTime';

export type Scope = 'global' | 'byLayoutID' | 'bySplitID';

export interface FileSystemPrefs {
  dateFormat: DateFmt;
  quantityFormat: QuantityFmt;
  root: string;
  showHiddenFiles: boolean;
  sortDirectories: SortOrder;
  timeFormat: TimeFmt;
  visibility: Record<string, boolean>;
}

export interface FileSystemPrefsStateModel {
  byLayoutID: Record<string, FileSystemPrefs>;
  bySplitID: Record<string, FileSystemPrefs>;
  global: FileSystemPrefs;
  scope: Scope;
}

@Injectable({ providedIn: 'root' })
@Persistence({ path: 'fileSystemPrefs', useClass: StorageService })
@StateRepository()
@State<FileSystemPrefsStateModel>({
  name: 'fileSystemPrefs',
  defaults: {
    byLayoutID: {},
    bySplitID: {},
    global: FileSystemPrefsState.defaultPrefs(),
    scope: 'global'
  }
})
export class FileSystemPrefsState extends PrefsState<FileSystemPrefs>
  implements NgxsOnInit {
  //
  constructor(actions$: Actions, selection: SelectionState, utils: Utils) {
    super(actions$, selection, utils);
  }

  static defaultPrefs(): FileSystemPrefs {
    return {
      dateFormat: 'mediumDate',
      quantityFormat: 'bytes',
      root: Params.homeDir,
      showHiddenFiles: false,
      sortDirectories: 'first',
      timeFormat: 'none',
      visibility: {
        atime: false,
        btime: false,
        group: false,
        mode: true,
        mtime: true,
        name: true,
        size: true,
        user: false
      }
    };
  }

  @Computed() get dictionary(): Dictionary[] {
    return [
      { name: 'name', tag: 'Name' },
      { name: 'size', tag: 'Size', isNumber: true },
      { name: 'mtime', tag: 'Modified', isDate: true },
      { name: 'btime', tag: 'Created', isDate: true },
      { name: 'atime', tag: 'Accessed', isDate: true },
      { name: 'mode', tag: 'Mode' },
      { name: 'user', tag: 'User' },
      { name: 'group', tag: 'GID', isNumber: true }
    ];
  }
}
