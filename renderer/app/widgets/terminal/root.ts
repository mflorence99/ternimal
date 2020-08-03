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

  launch: WidgetLaunch = {
    description: 'Terminal',
    icon: ['fas', 'desktop'],
    implementation: 'TerminalComponent'
  };

  @Input() splitID: string;

}
