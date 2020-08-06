import { SelectionState } from '../../state/selection';
import { StorageService } from '../../services/storage';
import { Utils } from '../../services/utils';

import { scratch } from '../operators';

import { Actions } from '@ngxs/store';
import { Computed } from '@ngxs-labs/data/decorators';
import { DataAction } from '@ngxs-labs/data/decorators';
import { Injectable } from '@angular/core';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Payload } from '@ngxs-labs/data/decorators';
import { Persistence } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';

import { filter } from 'rxjs/operators';
import { patch } from '@ngxs/store/operators';

export type Attribute = 'name' | 'size' | 'mtime' | 'btime' | 'atime' | 'mode' | 'user' | 'group';
export type DateFmt = 'ago' | 'shortDate' | 'mediumDate' | 'longDate' | 'fullDate';
export type QuantityFmt = 'abbrev' | 'bytes' | 'number';
export type SortOrder = 'alpha' | 'first' | 'last';
export type TimeFmt = 'none' | 'shortTime' | 'mediumTime' | 'longTime' | 'fullTime';
export type Scope = 'global' | 'byLayoutID' | 'bySplitID';

interface DataActionParams {
  layoutID?: string;
  prefs?: FileSystemPrefs;
  scope?: Scope;
  splitID?: string;
}

export interface Dictionary {
  isDate?: boolean;
  isQuantity?: boolean;
  isString?: boolean;
  name: Attribute;
  showIcon?: boolean;
  showMono?: boolean;
  tag: string;
}

export interface FileSystemPrefs {
  dateFormat: DateFmt;
  initialPath: string;
  quantityFormat: QuantityFmt;
  showHiddenFiles: boolean;
  sortDirectories: SortOrder;
  timeFormat: TimeFmt;
  visibility: Record<Attribute, boolean>;
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
    byLayoutID: { },
    bySplitID: { },
    global: FileSystemPrefsState.defaultPrefs(),
    scope: 'global'
  }
})

export class FileSystemPrefsState extends NgxsDataRepository<FileSystemPrefsStateModel> {

  constructor(private actions$: Actions,
              private selection: SelectionState,
              private utils: Utils) {
    super();
    this.handleActions$();
  }

  static defaultPrefs(): FileSystemPrefs {
    return {
      dateFormat: 'mediumDate',
      initialPath: '/',
      quantityFormat: 'bytes',
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

  static emptyPrefs(): FileSystemPrefs {
    const nullify = (obj: any): any => {
      Object.keys(obj).reduce((acc, key) => {
        acc[key] = (typeof obj[key] === 'object') ? nullify(obj[key]) : null;
        return acc;
      }, { });
    };
    return nullify(FileSystemPrefsState.defaultPrefs());
  }

  // actions

  @DataAction({ insideZone: true })
  remove(@Payload('FileSystemPrefsState.remove') { layoutID, splitID }: DataActionParams): void {
    if (layoutID && !splitID)
      this.ctx.setState(patch({ byLayoutID: scratch(layoutID) }));
    else if (!layoutID && splitID)
      this.ctx.setState(patch({ bySplitID: scratch(splitID) }));
  }

  @DataAction({ insideZone: true })
  rescope(@Payload('FileSystemPrefsState.rescope') { scope}: DataActionParams): void {
    this.ctx.setState(patch({ scope }));
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

  // accessors

  @Computed() get dictionary(): Dictionary[] {
    return [
      { name: 'name', tag: 'Name', isString: true, showIcon: true },
      { name: 'size', tag: 'Size', isQuantity: true },
      { name: 'mtime', tag: 'Modified', isDate: true },
      { name: 'btime', tag: 'Created', isDate: true },
      { name: 'atime', tag: 'Accessed', isDate: true },
      { name: 'mode', tag: 'Mode', isString: true, showMono: true },
      { name: 'user', tag: 'User', isString: true },
      { name: 'group', tag: 'Group', isString: true }
    ];
  }

  @Computed() get byLayoutID(): FileSystemPrefs {
    return this.snapshot.byLayoutID[this.selection.layoutID] ?? FileSystemPrefsState.emptyPrefs();
  }

  @Computed() get bySplitID(): FileSystemPrefs {
    return this.snapshot.bySplitID[this.selection.splitID] ?? FileSystemPrefsState.emptyPrefs();
  }

  @Computed() get global(): FileSystemPrefs {
    return this.snapshot.global;
  }

  @Computed() get scope(): Scope {
    return this.snapshot.scope;
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  currentPrefs(layoutID: string, splitID: string): FileSystemPrefs {
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
