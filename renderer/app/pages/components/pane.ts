import * as widgets from '../../widgets/all-widgets';

import { Channels } from '../../common';
import { DestroyService } from '../../services/destroy';
import { Layout } from '../../state/layout';
import { LayoutState } from '../../state/layout';
import { PanesState } from '../../state/panes';
import { Params } from '../../services/params';
import { SelectionState } from '../../state/selection';
import { SortState } from '../../state/sort';
import { Status } from '../../state/status';
import { StatusState } from '../../state/status';
import { TabsState } from '../../state/tabs';
import { TernimalState } from '../../state/ternimal';
import { Widget } from '../../widgets/widget';
import { WidgetCommand } from '../../widgets/widget';
import { WidgetHostDirective } from '../directives/widget-host';

import { Actions } from '@ngxs/store';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { ComponentFactoryResolver } from '@angular/core';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { ElectronService } from 'ngx-electron';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  selector: 'ternimal-pane',
  templateUrl: 'pane.html',
  styleUrls: ['pane.scss']
})
export class PaneComponent implements OnInit {
  static allWidgets: Widget[] = Object.keys(widgets).map(
    (nm) => new widgets[nm]()
  );

  @ViewChild(ContextMenuComponent, { static: true })
  contextMenu: ContextMenuComponent;

  effectiveStatus: Status = StatusState.defaultStatus();

  @Input() index: number;
  @Input() split: Layout;
  @Input() splittable: Layout;

  widget: Widget;
  widgets: Widget[] = PaneComponent.allWidgets;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild(WidgetHostDirective, { static: true })
  widgetHost: WidgetHostDirective;

  constructor(
    private actions$: Actions,
    private cdf: ChangeDetectorRef,
    private destroy$: DestroyService,
    public electron: ElectronService,
    public layout: LayoutState,
    public panes: PanesState,
    public tabs: TabsState,
    private resolver: ComponentFactoryResolver,
    public selection: SelectionState,
    public sort: SortState,
    public status: StatusState,
    public ternimal: TernimalState
  ) {}

  cancelLongRunningOp(): void {
    this.electron.ipcRenderer.send(
      Channels.longRunningOpCancel,
      this.ternimal.longRunningOp.id
    );
  }

  close(): void {
    this.layout.closeSplit({
      splitID: this.splittable.id,
      ix: this.index,
      visitor: (split) => {
        // TODO: keep in sync with remove in tabs.ts
        // NOTE: why not listen for an action change? Because none of these
        // states is primary -- there's no "split" state to remove
        this.panes.remove({ splitID: split.id });
        this.sort.remove({ splitID: split.id });
        this.status.remove({ splitID: split.id });
      }
    });
    // if the split we're removing is currently selected, try to select another
    if (this.isSelected())
      this.selection.selectSplit({ splitID: this.splittable.splits[0].id });
  }

  cwdir(): string {
    const parts = this.cwdParts();
    return parts[parts.length - 1];
  }

  cwdGoto(path: string): void {
    const parts = this.cwdParts();
    const ix = parts.findIndex((part) => part === path);
    // NOTE: we are already at the end!
    if (ix < parts.length) {
      path = parts.slice(0, ix + 1).join('');
      eval(`this.widget.${this.widget.widgetStatus.gotoCWD}('${path}')`);
    }
  }

  cwdParts(): string[] {
    return (this.effectiveStatus.cwd || '')
      .split(Params.pathSeparator)
      .filter((part) => !!part)
      .map((part) => `${Params.pathSeparator}${part}`);
  }

  execute(command: string): void {
    eval(`this.widget.${command}`);
  }

  executeCommand(command: WidgetCommand): void {
    this.execute(command.command);
  }

  isCloseEnabled(): boolean {
    return this.splittable.splits?.length > 1;
  }

  isCommandEnabled(command: WidgetCommand): boolean {
    if (command.if) return eval(`this.widget.${command.if}`);
    else if (command.unless) return !eval(`this.widget.${command.unless}`);
    else return true;
  }

  isLaunched(widget: Widget): boolean {
    const prefs = this.panes.prefs(this.split.id);
    return widget.widgetLaunch.implementation === prefs.widget;
  }

  isSelected(): boolean {
    return this.split.id === this.selection.splitID;
  }

  keydown(event: KeyboardEvent): void {
    if (this.isSelected() && this.widget.widgetMenuItems) {
      const menuItem = this.widget.widgetMenuItems
        .flat()
        .filter((menuItem) => menuItem.accelerator?.key)
        .find((menuItem) => {
          return (
            event.key === menuItem.accelerator.key &&
            event.ctrlKey === !!menuItem.accelerator.ctrlKey
          );
        });
      if (menuItem && this.isCommandEnabled(menuItem))
        this.executeCommand(menuItem);
    }
  }

  launch(widget: Widget): void {
    if (
      this.widget.widgetLaunch.implementation !==
      widget.widgetLaunch.implementation
    ) {
      this.panes.update({
        splitID: this.split.id,
        prefs: {
          widget: widget.widgetLaunch.implementation
        }
      });
      this.launchImpl(widget.widgetLaunch.implementation);
    }
  }

  ngOnInit(): void {
    this.handleActions$();
    const prefs = this.panes.prefs(this.split.id);
    this.launchImpl(prefs.widget);
  }

  select(): void {
    if (!this.isSelected())
      this.selection.selectSplit({ splitID: this.split.id });
  }

  setSearch(search: string): void {
    this.updateSearch({ search });
  }

  splitDown(): void {
    this.makeSplit({
      splitID: this.splittable.id,
      ix: this.index,
      direction: 'vertical',
      before: false
    });
  }

  splitLeft(): void {
    this.makeSplit({
      splitID: this.splittable.id,
      ix: this.index,
      direction: 'horizontal',
      before: true
    });
  }

  splitRight(): void {
    this.makeSplit({
      splitID: this.splittable.id,
      ix: this.index,
      direction: 'horizontal',
      before: false
    });
  }

  splitUp(): void {
    this.makeSplit({
      splitID: this.splittable.id,
      ix: this.index,
      direction: 'vertical',
      before: true
    });
  }

  toggleSearchCaseSensitive(): void {
    this.updateSearch({
      searchCaseSensitive: !this.effectiveStatus.searchCaseSensitive
    });
  }

  toggleSearchRegex(): void {
    this.updateSearch({
      searchRegex: !this.effectiveStatus.searchRegex
    });
  }

  toggleSearchWholeWord(): void {
    this.updateSearch({
      searchWholeWord: !this.effectiveStatus.searchWholeWord
    });
  }

  // private methods

  private handleActions$(): void {
    // NOTE: trigger change detection on any action
    this.actions$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.effectiveStatus = this.status.status(
        this.widget.splitID,
        this.widget.widgetLaunch.implementation
      );
      this.cdf.markForCheck();
    });
  }

  private launchImpl(implementation: string): void {
    this.widgetHost.vcRef.clear();
    // @see https://stackoverflow.com/questions/40528592
    const cFactory = this.resolver.resolveComponentFactory(
      widgets[implementation]
    );
    this.widget = this.widgetHost.vcRef.createComponent(cFactory)
      .instance as Widget;
    // populate the widget with our input
    this.widget.splitID = this.split.id;
  }

  private makeSplit(params: any): void {
    const prefs = this.panes.prefs(this.split.id);
    // make new pane just like this one
    this.layout.makeSplit({
      ...params,
      visitor: (split) => {
        if (!this.panes.snapshot[split.id])
          this.panes.update({ splitID: split.id, prefs });
      }
    });
  }

  private updateSearch(status: Partial<Status>): void {
    this.status.update({
      splitID: this.widget.splitID,
      widgetID: this.widget.widgetLaunch.implementation,
      status: status
    });
  }
}
