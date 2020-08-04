import * as prefs from '../../widgets/all-prefs';
import * as widgets from '../../widgets/all-widgets';

import { PanesState } from '../../state/panes';
import { SelectionState } from '../../state/selection';
import { Widget } from '../../widgets/widget';
import { WidgetHostDirective } from '../directives/widget-host';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ComponentFactoryResolver } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-widget-prefs',
  templateUrl: 'widget-prefs.html',
  styleUrls: ['widget-prefs.scss']
})

export class WidgetPrefsComponent implements OnInit {

  static allWidgets: Widget[] = Object.keys(widgets).map(nm => new widgets[nm]);

  @ViewChild(WidgetHostDirective, { static: true }) widgetHost: WidgetHostDirective;

  constructor(public panes: PanesState,
              private resolver: ComponentFactoryResolver,
              public selection: SelectionState) { }

  ngOnInit(): void {
    const panePrefs = this.panes.panePrefs(this.selection.splitID);
    const widget = WidgetPrefsComponent.allWidgets.find(widget => widget.launch.implementation === panePrefs.widget);
    this.widgetHost.vcRef.clear();
    // @see https://stackoverflow.com/questions/40528592
    const cFactory = this.resolver.resolveComponentFactory(prefs[widget.prefs.implementation]);
    this.widgetHost.vcRef.createComponent(cFactory);
  }

}
