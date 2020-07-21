import { LayoutState } from './layout';
import { SelectionState } from './selection';
import { TabsState } from './tabs';
import { TernimalState } from './ternimal';

import { states } from './app';

import { NGXS_DATA_STORAGE_PLUGIN } from '@ngxs-labs/data/storage';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';
import { TestBed } from '@angular/core/testing';

export interface Bundle {
  layout?: LayoutState;
  selection?: SelectionState;
  tabs?: TabsState;
  ternimal?: TernimalState;
}

export function prepare(): Bundle {

  const bundle: Bundle = { };

  TestBed.configureTestingModule({
    imports: [
      NgxsModule.forRoot(states),
      NgxsDataPluginModule.forRoot([NGXS_DATA_STORAGE_PLUGIN]),
    ]
  });

  bundle.layout = TestBed.inject(LayoutState);
  bundle.selection = TestBed.inject(SelectionState);
  bundle.tabs = TestBed.inject(TabsState);
  bundle.ternimal = TestBed.inject(TernimalState);

  return bundle;

}

describe('State tests helpers', () => {

  test('Dummy test', () => {
    expect(true).toBeTruthy();
  });

});
