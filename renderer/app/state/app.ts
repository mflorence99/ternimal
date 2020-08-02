import { LayoutState } from './layout';
import { LayoutStateModel } from './layout';
import { PanesState } from './panes';
import { PanesStateModel } from './panes';
import { ProcessesState } from './processes';
import { ProcessesStateModel } from './processes';
import { SelectionState } from './selection';
import { SelectionStateModel } from './selection';
import { SortState } from './sort';
import { SortStateModel } from './sort';
import { TabsState } from './tabs';
import { TabsStateModel } from './tabs';
import { TernimalState } from './ternimal';
import { TernimalStateModel } from './ternimal';

export interface AppState {
  layout: LayoutStateModel;
  panes: PanesStateModel;
  processes: ProcessesStateModel;
  selection: SelectionStateModel;
  sort: SortStateModel;
  tabs: TabsStateModel;
  ternimal: TernimalStateModel;
}

export const states = [
  LayoutState,
  PanesState,
  ProcessesState,
  SelectionState,
  SortState,
  TabsState,
  TernimalState
];
