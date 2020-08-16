import { SelectionState } from '../../state/selection';
import { Tab } from '../../state/tabs';
import { TabsComponent } from './tabs';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ternimal-header',
  templateUrl: 'header.html',
  styleUrls: ['header.scss']
})
export class HeaderComponent {
  @ViewChild(TabsComponent, { static: true }) tabs: TabsComponent;

  constructor(public selection: SelectionState) {}

  isMoreSelected(): boolean {
    return this.tabs.inMore.some(
      (tab) => tab.layoutID === this.selection.layoutID
    );
  }

  isTabsSelected(tab: Tab): boolean {
    return tab.layoutID === this.selection.layoutID;
  }
}
