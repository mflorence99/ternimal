import { LayoutState } from '../../state/layout';
import { SelectionState } from '../../state/selection';
import { Tab } from '../../state/tabs';
import { TabsState } from '../../state/tabs';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ResizeObserverEntry } from 'ngx-resize-observer';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-tabs',
  templateUrl: 'tabs.html',
  styleUrls: ['tabs.scss']
})

export class TabsComponent {

  /** ctor */
  constructor(public layout: LayoutState,
              public selection: SelectionState,
              public tabs: TabsState) { }

  /** Handle resize of tabs */
  handleResize(resize: ResizeObserverEntry): void {
    console.log({ tabs: resize.contentRect.width });
  }

  /** Measure the size of an individual tab (they're all the same size) */
  measureTab(resize: ResizeObserverEntry): void {
    console.log({ tab: resize.contentRect.width });
  }

  /** Remove tab */
  remove(tab: Tab): void {
    // TODO:
    this.layout.removeLayout({ layoutID: tab.layoutID, visitor: null });
    this.tabs.removeTab({ tab });
    this.selection.selectLayout({ layoutID: this.tabs.snapshot[0].layoutID });
  }

  /** Select tab */
  select(tab: Tab): void {
    if (tab.layoutID !== this.selection.layoutID)
      this.selection.selectLayout({ layoutID: tab.layoutID });
  }

}
