import { TernimalState } from './ternimal';
import { TernimalStateModel } from './ternimal';

export interface AppState {
  selection: TernimalStateModel;
}

export const states = [
  TernimalState
];
