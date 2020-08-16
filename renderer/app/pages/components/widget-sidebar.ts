import * as sidebars from '../../widgets/all-sidebars';
import * as widgets from '../../widgets/all-widgets';

import { PanesState } from '../../state/panes';
import { SelectionState } from '../../state/selection';
import { TernimalState } from '../../state/ternimal';
import { Widget } from '../../widgets/widget';
import { WidgetHostDirective } from '../directives/widget-host';
import { WidgetPrefs } from '../../widgets/widget-prefs';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ComponentFactoryResolver } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ternimal-widget-sidebar',
  templateUrl: 'widget-sidebar.html',
  styleUrls: ['widget-sidebar.scss']
})
export class WidgetSidebarComponent implements OnInit {
  static allWidgets: Widget[] = Object.keys(widgets).map(
    (nm) => new widgets[nm]()
  );

  @ViewChild(WidgetHostDirective, { static: true })
  widgetHost: WidgetHostDirective;

  constructor(
    public panes: PanesState,
    private resolver: ComponentFactoryResolver,
    public selection: SelectionState,
    public ternimal: TernimalState
  ) {}

  ngOnInit(): void {
    const panePrefs = this.panes.prefs(this.selection.splitID);
    const widget = WidgetSidebarComponent.allWidgets.find(
      (widget) => widget.widgetLaunch.implementation === panePrefs.widget
    );
    this.widgetHost.vcRef.clear();
    // @see https://stackoverflow.com/questions/40528592
    const cFactory = this.resolver.resolveComponentFactory(
      sidebars[this.ternimal.widgetSidebarImpl]
    );
    const widgetPrefs = this.widgetHost.vcRef.createComponent(cFactory)
      .instance as WidgetPrefs;
    widgetPrefs.widget = widget;
  }
}
