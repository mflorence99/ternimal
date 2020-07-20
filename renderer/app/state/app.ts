import { LayoutState } from './layout';
import { LayoutStateModel } from './layout';
import { TernimalState } from './ternimal';
import { TernimalStateModel } from './ternimal';

export interface AppState {
  layout: LayoutStateModel;
  selection: TernimalStateModel;
}

export const states = [
  LayoutState,
  TernimalState
];
