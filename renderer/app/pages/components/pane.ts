import * as widgets from '../../widgets/all-widgets';

import { DestroyService } from '../../services/destroy';
import { Layout } from '../../state/layout';
import { LayoutState } from '../../state/layout';
import { PanesState } from '../../state/panes';
import { Params } from '../../services/params';
import { SelectionState } from '../../state/selection';
import { SortState } from '../../state/sort';
import { StatusState } from '../../state/status';
import { TabsState } from '../../state/tabs';
import { TernimalState } from '../../state/ternimal';
import { Utils } from '../../services/utils';
import { Widget } from '../../widgets/widget';
import { WidgetCommand } from '../../widgets/widget';
import { WidgetHostDirective } from '../directives/widget-host';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ComponentFactoryResolver } from '@angular/core';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
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

  @Input() index: number;
  @Input() split: Layout;
  @Input() splittable: Layout;

  widget: Widget;
  widgets: Widget[] = PaneComponent.allWidgets;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild(WidgetHostDirective, { static: true })
  widgetHost: WidgetHostDirective;

  constructor(
    public layout: LayoutState,
    public panes: PanesState,
    public tabs: TabsState,
    private resolver: ComponentFactoryResolver,
    public selection: SelectionState,
    public sort: SortState,
    public status: StatusState,
    public ternimal: TernimalState,
    private utils: Utils
  ) {}

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

  cwd(): string {
    return this.status.status(
      this.widget.splitID,
      this.widget.widgetLaunch.implementation
    ).cwd;
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
    return this.cwd()
      .split(Params.pathSeparator)
      .filter((part) => !!part)
      .map((part) => `${Params.pathSeparator}${part}`);
  }

  executeCommand(command: WidgetCommand): void {
    eval(`this.widget.${command.command}`);
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
    console.log(event);
    if (this.isSelected()) {
      const menuItem = this.widget.widgetMenuItems
        .flat()
        .filter((menuItem) => menuItem.accelerator)
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
    this.launchImpl(widget.widgetLaunch.implementation);
    this.panes.update({
      splitID: this.split.id,
      prefs: {
        widget: widget.widgetLaunch.implementation
      }
    });
  }

  ngOnInit(): void {
    const prefs = this.panes.prefs(this.split.id);
    this.launchImpl(prefs.widget);
  }

  select(): void {
    if (!this.isSelected())
      this.selection.selectSplit({ splitID: this.split.id });
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

  // private methods

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
}
