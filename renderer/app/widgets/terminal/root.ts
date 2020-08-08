import { Widget } from '../widget';
import { WidgetLaunch } from '../widget';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-terminal-root',
  template: '',
  styles: [':host { display: block; }']
})

export class TerminalComponent implements Widget {

  @Input() splitID: string;

  widgetLaunch: WidgetLaunch = {
    description: 'Terminal',
    icon: ['fas', 'terminal'],
    implementation: 'TerminalComponent'
  };

}
