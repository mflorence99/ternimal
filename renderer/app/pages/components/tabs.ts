import { ConfirmDialogComponent } from '../../components/confirm-dialog';
import { ConfirmDialogModel } from '../../components/confirm-dialog';
import { DestroyService } from '../../services/destroy';
import { LayoutState } from '../../state/layout';
import { PanesState } from '../../state/panes';
import { Params } from '../../services/params';
import { SelectionState } from '../../state/selection';
import { SortState } from '../../state/sort';
import { StatusState } from '../../state/status';
import { Tab } from '../../state/tabs';
import { TabsState } from '../../state/tabs';
import { TernimalState } from '../../state/ternimal';
import { Utils } from '../../services/utils';

import { Actions } from '@ngxs/store';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OnInit } from '@angular/core';
import { ResizeObserverEntry } from 'ngx-resize-observer';

import { filter } from 'rxjs/operators';
import { from } from 'rxjs';
import { take } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { timer } from 'rxjs';
import { zip } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  selector: 'ternimal-tabs',
  templateUrl: 'tabs.html',
  styleUrls: ['tabs.scss']
})
export class TabsComponent implements OnInit {
  inMore: Tab[] = [];
  inTabs: Tab[] = [];

  private containerWidth = 0;
  private moreWidth = 0;
  private tabWidth = 0;

  constructor(
    private actions$: Actions,
    private cdf: ChangeDetectorRef,
    private destroy$: DestroyService,
    private dialog: MatDialog,
    public layout: LayoutState,
    public panes: PanesState,
    private params: Params,
    public selection: SelectionState,
    public sort: SortState,
    public status: StatusState,
    public tabs: TabsState,
    public ternimal: TernimalState,
    private utils: Utils
  ) {}

  confirmRemove(event: MouseEvent, tab: Tab): void {
    const message =
      'Are you sure you want to proceed? This operation cannot be undone and all sessions will be terminated.';
    const title = 'Confirm Tab Removal';
    this.dialog
      .open(ConfirmDialogComponent, {
        data: new ConfirmDialogModel(title, message)
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.remove(tab);
      });
    // NOTE: don't select this tab
    event.preventDefault();
    event.stopPropagation();
  }

  drop(event: CdkDragDrop<Tab>): void {
    if (Array.isArray(event.item.data)) {
      // NOTE: attempt to animate this
      zip(timer(0, this.params.tabsMoveInterval), from(event.item.data))
        .pipe(take(event.item.data.length))
        .subscribe(([ix, tab]) =>
          this.tabs.move({ tab, ix: event.currentIndex + ix })
        );
    } else this.tabs.move({ tab: event.item.data, ix: event.currentIndex });
  }

  handleResize(resize: ResizeObserverEntry): void {
    this.containerWidth = resize.contentRect.width;
    this.whichTabs();
  }

  isInMore(layoutID: string): boolean {
    return !!this.inMore.find((tab) => layoutID === tab.layoutID);
  }

  measureMore(resize: ResizeObserverEntry): void {
    if (this.moreWidth === 0) {
      this.moreWidth = resize.contentRect.width;
      this.whichTabs();
    }
  }

  measureTab(resize: ResizeObserverEntry): void {
    if (this.tabWidth === 0) {
      this.tabWidth = resize.contentRect.width;
      this.whichTabs();
    }
  }

  ngOnInit(): void {
    this.handleActions$();
  }

  remove(tab: Tab): void {
    const ix = this.tabs.findTabIndexByID(tab.layoutID);
    this.tabs.remove({ tab });
    this.layout.remove({
      layoutID: tab.layoutID,
      visitor: (split) => {
        // TODO: keep in sync with close in pane.ts
        // NOTE: why not listen for an action change? Because none of these
        // states is primary -- there's no "split" state to remove
        this.panes.remove({ splitID: split.id });
        this.sort.remove({ splitID: split.id });
        this.status.remove({ splitID: split.id });
      }
    });
    // if the tab we're removing is currently selected, select another
    if (tab.layoutID === this.selection.layoutID) {
      const iy = Math.min(ix, this.tabs.snapshot.length - 1);
      this.selection.selectLayout({
        layoutID: this.tabs.snapshot[iy].layoutID
      });
      this.ternimal.hideTabPrefs();
    }
  }

  select(tab: Tab): void {
    if (tab && tab.layoutID !== this.selection.layoutID)
      this.selection.selectLayout({ layoutID: tab.layoutID });
  }

  // private methods

  private handleActions$(): void {
    this.actions$
      .pipe(
        filter(({ action, status }) => {
          return (
            this.utils.hasProperty(action, /^TabsState\./) &&
            status === 'SUCCESSFUL'
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.whichTabs();
        this.cdf.markForCheck();
      });
  }

  private whichTabs(): void {
    const count =
      this.tabs.snapshot.length === 1 || this.tabWidth === 0
        ? 1
        : Math.max(
            Math.trunc((this.containerWidth - this.moreWidth) / this.tabWidth) -
              1,
            0
          );
    this.inMore = this.tabs.snapshot.slice(count);
    this.inTabs = this.tabs.snapshot.slice(0, count);
  }
}
