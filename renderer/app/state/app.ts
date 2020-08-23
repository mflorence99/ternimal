import { FileSystemClipboardState } from './file-system/clipboard';
import { FileSystemClipboardStateModel } from './file-system/clipboard';
import { FileSystemFilesState } from './file-system/files';
import { FileSystemFilesStateModel } from './file-system/files';
import { FileSystemPathsState } from './file-system/paths';
import { FileSystemPathsStateModel } from './file-system/paths';
import { FileSystemPrefs } from './file-system/prefs';
import { FileSystemPrefsState } from './file-system/prefs';
import { LayoutState } from './layout';
import { LayoutStateModel } from './layout';
import { PanesState } from './panes';
import { PanesStateModel } from './panes';
import { PrefsStateModel } from './prefs';
import { ProcessListPrefs } from './processes/prefs';
import { ProcessListPrefsState } from './processes/prefs';
import { ProcessListState } from './processes/list';
import { ProcessListStateModel } from './processes/list';
import { SelectionState } from './selection';
import { SelectionStateModel } from './selection';
import { SortState } from './sort';
import { SortStateModel } from './sort';
import { StatusState } from './status';
import { StatusStateModel } from './status';
import { TabsState } from './tabs';
import { TabsStateModel } from './tabs';
import { TerminalPrefs } from './terminal/prefs';
import { TerminalPrefsState } from './terminal/prefs';
import { TernimalState } from './ternimal';
import { TernimalStateModel } from './ternimal';

export interface AppState {
  fileSystemClipboard: FileSystemClipboardStateModel;
  fileSystemFiles: FileSystemFilesStateModel;
  fileSystemPaths: FileSystemPathsStateModel;
  fileSystemPrefs: PrefsStateModel<FileSystemPrefs>;
  layout: LayoutStateModel;
  panes: PanesStateModel;
  processList: ProcessListStateModel;
  processListPrefs: PrefsStateModel<ProcessListPrefs>;
  selection: SelectionStateModel;
  sort: SortStateModel;
  status: StatusStateModel;
  tabs: TabsStateModel;
  terminalPrefs: PrefsStateModel<TerminalPrefs>;
  ternimal: TernimalStateModel;
}

export const states = [
  FileSystemClipboardState,
  FileSystemFilesState,
  FileSystemPathsState,
  FileSystemPrefsState,
  LayoutState,
  PanesState,
  ProcessListState,
  ProcessListPrefsState,
  SelectionState,
  SortState,
  StatusState,
  TabsState,
  TerminalPrefsState,
  TernimalState
];
