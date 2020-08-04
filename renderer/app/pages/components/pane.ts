import * as widgets from '../../widgets/all-widgets';

import { Layout } from '../../state/layout';
import { LayoutState } from '../../state/layout';
import { PanesState } from '../../state/panes';
import { SelectionState } from '../../state/selection';
import { SortState } from '../../state/sort';
import { TabsState } from '../../state/tabs';
import { TernimalState } from '../../state/ternimal';
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
  selector: 'ternimal-pane',
  templateUrl: 'pane.html',
  styleUrls: ['pane.scss']
})

export class PaneComponent implements OnInit {

  static allWidgets: Widget[] = Object.keys(widgets).map(nm => new widgets[nm]);

  @ViewChild(ContextMenuComponent, { static: true }) contextMenu: ContextMenuComponent;

  @Input() index: number;
  @Input() split: Layout;
  @Input() splittable: Layout;

  widget: Widget;
  widgets: Widget[] = PaneComponent.allWidgets;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild(WidgetHostDirective, { static: true }) widgetHost: WidgetHostDirective;

  constructor(public layout: LayoutState,
              public panes: PanesState,
              public tabs: TabsState,
              private resolver: ComponentFactoryResolver,
              public selection: SelectionState,
              public sort: SortState,
              public ternimal: TernimalState) { }

  closePane(): void {
    this.layout.closeSplit({ 
      splitID: this.splittable.id, 
      ix: this.index,
      visitor: split => {
        this.panes.remove({ splitID: split.id });
        this.sort.remove({ splitID: split.id });
      }
    });
    // if the split we're removing is currently selected, try to select another
    if (this.isSelected()) 
      this.selection.selectSplit({ splitID: this.splittable.splits[0].id });
  }

  executeCommand(command: WidgetCommand): void {
    eval(`this.widget.${command.command}`);
  }

  isCloseEnabled(): boolean {
    return this.splittable.splits?.length > 1;
  }

  isCommandEnabled(command: WidgetCommand): boolean {
    if (command.if)
      return eval(`this.widget.${command.if}`);
    else if (command.unless)
      return !eval(`this.widget.${command.unless}`);
    else return true;
  }

  isLaunched(widget: Widget): boolean {
    const panePrefs = this.panes.panePrefs(this.split.id);
    return widget.launch.implementation === panePrefs.widget;
  }

  isSelected(): boolean {
    return this.split.id === this.selection.splitID;
  }

  launch(widget: Widget): void {
    this.launchImpl(widget.launch.implementation);
    this.panes.update({ splitID: this.split.id, panePrefs: {
      widget: widget.launch.implementation
    }});
  }

  ngOnInit(): void {
    const panePrefs = this.panes.panePrefs(this.split.id);
    this.launchImpl(panePrefs.widget);
  }

  select(): void {
    if (!this.isSelected())
      this.selection.selectSplit({ splitID: this.split.id });
  }

  splitDown(): void {
    this.layout.makeSplit({ splitID: this.splittable.id, ix: this.index, direction: 'vertical', before: false });
  }

  splitLeft(): void {
    this.layout.makeSplit({ splitID: this.splittable.id, ix: this.index, direction: 'horizontal', before: true });
  }

  splitRight(): void {
    this.layout.makeSplit({ splitID: this.splittable.id, ix: this.index, direction: 'horizontal', before: false });
  }

  splitUp(): void {
    this.layout.makeSplit({ splitID: this.splittable.id, ix: this.index, direction: 'vertical', before: true });
  }

  // private methods

  private launchImpl(implementation: string): void {
    this.widgetHost.vcRef.clear();
    // @see https://stackoverflow.com/questions/40528592
    const cFactory = this.resolver.resolveComponentFactory(widgets[implementation]);
    this.widget = this.widgetHost.vcRef.createComponent(cFactory).instance as Widget;
    // populate the widget with our input
    this.widget.splitID = this.split.id;      
  }

}
