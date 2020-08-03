import { Widget } from '../widget';
import { WidgetLaunch } from '../widget';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-file-system-root',
  template: '',
  styles: [':host { display: block; }']
})

export class FileSystemComponent implements Widget {

  launch: WidgetLaunch = {
    description: 'FileSystem',
    icon: ['fas', 'database'],
    implementation: 'FileSystemComponent'
  };

  @Input() splitID: string;

}
