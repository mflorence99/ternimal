import { FileSystemFilesState } from './file-system/files';
import { FileSystemFilesStateModel } from './file-system/files';
import { FileSystemPathsState } from './file-system/paths';
import { FileSystemPathsStateModel } from './file-system/paths';
import { FileSystemPrefsState } from './file-system/prefs';
import { FileSystemPrefsStateModel } from './file-system/prefs';
import { LayoutState } from './layout';
import { LayoutStateModel } from './layout';
import { PanesState } from './panes';
import { PanesStateModel } from './panes';
import { ProcessListState } from './processes/list';
import { ProcessListStateModel } from './processes/list';
import { SelectionState } from './selection';
import { SelectionStateModel } from './selection';
import { SortState } from './sort';
import { SortStateModel } from './sort';
import { TabsState } from './tabs';
import { TabsStateModel } from './tabs';
import { TernimalState } from './ternimal';
import { TernimalStateModel } from './ternimal';

export interface AppState {
  fileSystemFiles: FileSystemFilesStateModel;
  fileSystemPaths: FileSystemPathsStateModel;
  fileSystemPrefs: FileSystemPrefsStateModel;
  layout: LayoutStateModel;
  panes: PanesStateModel;
  processList: ProcessListStateModel;
  selection: SelectionStateModel;
  sort: SortStateModel;
  tabs: TabsStateModel;
  ternimal: TernimalStateModel;
}

export const states = [
  FileSystemFilesState,
  FileSystemPathsState,
  FileSystemPrefsState,
  LayoutState,
  PanesState,
  ProcessListState,
  SelectionState,
  SortState,
  TabsState,
  TernimalState
];
