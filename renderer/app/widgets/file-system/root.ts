import { Widget } from '../widget';
import { WidgetLaunch } from '../widget';
import { WidgetPrefs } from '../widget';

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
    description: 'File System',
    icon: ['fas', 'database'],
    implementation: 'FileSystemComponent'
  };

  prefs: WidgetPrefs = {
    description: 'File System setup',
    implementation: 'FileSystemPrefsComponent'
  };

  @Input() splitID: string;

}
