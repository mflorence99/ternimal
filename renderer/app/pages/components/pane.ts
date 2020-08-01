import * as widgets from '../../widgets';

import { Layout } from '../../state/layout';
import { LayoutState } from '../../state/layout';
import { SelectionState } from '../../state/selection';
import { SortState } from '../../state/sort';
import { TabsState } from '../../state/tabs';
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

  @ViewChild(WidgetHostDirective, { static: true }) widgetHost: WidgetHostDirective;

  constructor(public layout: LayoutState,
              public tabs: TabsState,
              private resolver: ComponentFactoryResolver,
              public selection: SelectionState,
              public sort: SortState) { }

  closePane(): void {
    this.layout.closeSplit({ 
      splitID: this.splittable.id, 
      ix: this.index,
      // TODO
      visitor: split => this.sort.remove({ splitID: split.id })
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

  isSelected(): boolean {
    return this.split.id === this.selection.splitID;
  }

  ngOnInit(): void {
    // TODO
    if (this.split.id === 'dff51a77-63fc-c99d-1f7e-78f549c3dbc6') {
      this.widgetHost.vcRef.clear();
      // @see https://stackoverflow.com/questions/40528592
      const cFactory = this.resolver.resolveComponentFactory(widgets['ProcessesComponent']);
      this.widget = this.widgetHost.vcRef.createComponent(cFactory).instance;
      // populate the widget with our input
      this.widget.splitID = this.split.id;      
    }
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

}
