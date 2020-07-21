import { LayoutState } from './layout';
import { LayoutStateModel } from './layout';
import { SelectionState } from './selection';
import { SelectionStateModel } from './selection';
import { TabsState } from './tabs';
import { TabsStateModel } from './tabs';
import { TernimalState } from './ternimal';
import { TernimalStateModel } from './ternimal';

export interface AppState {
  layout: LayoutStateModel;
  selection: SelectionStateModel;
  tabs: TabsStateModel;
  ternimal: TernimalStateModel;
}

export const states = [
  LayoutState,
  SelectionState,
  TabsState,
  TernimalState
];
