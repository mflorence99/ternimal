import { Params } from '../services/params';
import { SelectionState } from './selection';
import { StorageService } from '../services/storage';

import { Computed } from '@ngxs-labs/data/decorators';
import { DataAction } from '@ngxs-labs/data/decorators';
import { Injectable } from '@angular/core';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { Payload } from '@ngxs-labs/data/decorators';
import { Persistence } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';

import { append } from '@ngxs/store/operators';
import { insertItem } from '@ngxs/store/operators';
import { removeItem } from '@ngxs/store/operators';
import { updateItem } from '@ngxs/store/operators';

interface DataActionParams {
  ix?: number;
  tab: Tab;
}

export interface Tab {
  color?: string;
  icon?: string[];
  label?: string;
  layoutID: string;
  showBadges?: boolean;
}

export type TabsStateModel = Tab[];

@Injectable({ providedIn: 'root' })
@Persistence({ path: 'tabs', useClass: StorageService })
@StateRepository()
@State<TabsStateModel>({
  name: 'tabs',
  defaults: TabsState.defaultTabs()
})
export class TabsState extends NgxsDataRepository<TabsStateModel> {
  //
  constructor(public selection: SelectionState) {
    super();
  }

  static defaultTabs(): Tab[] {
    return [
      {
        color: 'var(--mat-grey-100)',
        icon: ['fas', 'laptop'],
        label: 'My Ternimal',
        layoutID: Params.initialLayoutID,
        showBadges: true
      }
    ];
  }

  // actions

  @DataAction({ insideZone: true })
  move(@Payload('TabsState.move') { tab, ix }: DataActionParams): void {
    const iy = this.findTabIndexByID(tab.layoutID);
    if (ix !== iy && iy !== -1) {
      this.ctx.setState(insertItem(tab, ix > iy ? ix + 1 : ix));
      this.ctx.setState(removeItem(iy > ix ? iy + 1 : iy));
    }
  }

  @DataAction({ insideZone: true })
  newTab(@Payload('TabsState.newTab') { tab }: DataActionParams): void {
    this.ctx.setState(append([tab]));
  }

  @DataAction({ insideZone: true })
  remove(@Payload('TabsState.remove') { tab }: DataActionParams): void {
    const ix = this.findTabIndexByID(tab.layoutID);
    if (ix !== -1) this.ctx.setState(removeItem(ix));
  }

  @DataAction({ insideZone: true })
  update(@Payload('TabsState.update') { tab }: DataActionParams): void {
    const ix = this.findTabIndexByID(tab.layoutID);
    if (ix !== -1) this.ctx.setState(updateItem(ix, tab));
  }

  // accessors

  @Computed() get tab(): Tab {
    return this.findTabByID(this.selection.layoutID);
  }

  @Computed() get tabIndex(): number {
    return this.findTabIndexByID(this.selection.layoutID);
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  findTabByID(layoutID: string, model = this.snapshot): Tab {
    return model.find((tab) => tab.layoutID === layoutID);
  }

  findTabIndexByID(layoutID: string, model = this.snapshot): number {
    return model.findIndex((tab) => tab.layoutID === layoutID);
  }
}
