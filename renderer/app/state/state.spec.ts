import { FileSystemClipboardState } from './file-system/clipboard';
import { FileSystemFilesState } from './file-system/files';
import { FileSystemPathsState } from './file-system/paths';
import { FileSystemPrefsState } from './file-system/prefs';
import { LayoutState } from './layout';
import { PanesState } from './panes';
import { ProcessListPrefsState } from './processes/prefs';
import { ProcessListState } from './processes/list';
import { SelectionState } from './selection';
import { SortState } from './sort';
import { StatusState } from './status';
import { TabsState } from './tabs';
import { TerminalPrefsState } from './terminal/prefs';
import { TernimalState } from './ternimal';

import { states } from './app';

import { NGXS_DATA_STORAGE_PLUGIN } from '@ngxs-labs/data/storage';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';

export interface Bundle {
  fileSystemClipboard?: FileSystemClipboardState;
  fileSystemFiles?: FileSystemFilesState;
  fileSystemPaths?: FileSystemPathsState;
  fileSystemPrefs?: FileSystemPrefsState;
  layout?: LayoutState;
  panes?: PanesState;
  processList?: ProcessListState;
  processListPrefs?: ProcessListPrefsState;
  selection?: SelectionState;
  sort?: SortState;
  status?: StatusState;
  tabs?: TabsState;
  terminalPrefs?: TerminalPrefsState;
  ternimal?: TernimalState;
}

export function prepare(): Bundle {
  const bundle: Bundle = {};

  TestBed.configureTestingModule({
    imports: [
      NgxsModule.forRoot(states),
      NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_PLUGIN])
    ]
  });

  bundle.fileSystemClipboard = TestBed.inject(FileSystemClipboardState);
  bundle.fileSystemFiles = TestBed.inject(FileSystemFilesState);
  bundle.fileSystemPaths = TestBed.inject(FileSystemPathsState);
  bundle.fileSystemPrefs = TestBed.inject(FileSystemPrefsState);
  bundle.layout = TestBed.inject(LayoutState);
  bundle.panes = TestBed.inject(PanesState);
  bundle.processList = TestBed.inject(ProcessListState);
  bundle.processListPrefs = TestBed.inject(ProcessListPrefsState);
  bundle.selection = TestBed.inject(SelectionState);
  bundle.sort = TestBed.inject(SortState);
  bundle.status = TestBed.inject(StatusState);
  bundle.tabs = TestBed.inject(TabsState);
  bundle.terminalPrefs = TestBed.inject(TerminalPrefsState);
  bundle.ternimal = TestBed.inject(TernimalState);

  return bundle;
}

describe('State tests helpers', () => {
  test('Dummy test', () => {
    expect(true).toBeTruthy();
  });
});
