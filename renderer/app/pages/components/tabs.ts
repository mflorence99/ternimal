import { DestroyService } from '../../services/destroy';
import { LayoutState } from '../../state/layout';
import { SelectionState } from '../../state/selection';
import { Tab } from '../../state/tabs';
import { TabsState } from '../../state/tabs';

import { Actions } from '@ngxs/store';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ResizeObserverEntry } from 'ngx-resize-observer';

import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [DestroyService],
  selector: 'ternimal-tabs',
  templateUrl: 'tabs.html',
  styleUrls: ['tabs.scss']
})

export class TabsComponent {

  inMore: Tab[] = [];
  inTabs: Tab[] = [];

  private containerWidth = 0;
  private moreWidth = 0;
  private tabWidth = 0;

  /** ctor */
  constructor(private actions$: Actions,
              private destroy$: DestroyService,
              public layout: LayoutState,
              public selection: SelectionState,
              public tabs: TabsState) { 
    this.handleActions$();
  }

  /** Handle resize of tabs */
  handleResize(resize: ResizeObserverEntry): void {
    this.containerWidth = resize.contentRect.width;
    this.whichTabs();
  }

  /** Is a given tab in the more dropdown? */
  isInMore(layoutID: string): boolean {
    return !!this.inMore.find(tab => layoutID === tab.layoutID);
  }

  /** Measure the size of the "more" dropdown */
  measureMore(resize: ResizeObserverEntry): void {
    this.moreWidth = resize.contentRect.width;
    this.whichTabs();
  }

  /** Measure the size of an individual tab (they're all the same size) */
  measureTab(resize: ResizeObserverEntry): void {
    this.tabWidth = resize.contentRect.width;
    this.whichTabs();
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
    if (tab && (tab.layoutID !== this.selection.layoutID))
      this.selection.selectLayout({ layoutID: tab.layoutID });
  }

  // private methods

  private handleActions$(): void {
    this.actions$
      .pipe(
        filter(({ action, status }) => {
          return (action['TabsState.newTab']
            || action['TabsState.removeTab'])
            && (status === 'SUCCESSFUL');
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(_ => this.whichTabs());
  }

  private whichTabs(): void {
    const count = (this.tabWidth === 0) ? 1 :
      Math.trunc((this.containerWidth - this.moreWidth) / this.tabWidth) - 1;
    this.inMore = this.tabs.snapshot.slice(count);
    this.inTabs = this.tabs.snapshot.slice(0, count);
  }

}
