import { TabsState } from '../../state/tabs';
import { Widget } from '../widget';
import { WidgetPrefs } from '../widget-prefs';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-file-system-prefs',
  templateUrl: 'prefs.html',
  styleUrls: ['prefs.scss']
})

export class FileSystemPrefsComponent implements WidgetPrefs {

  @Input() widget: Widget;

  constructor(public tabs: TabsState) { }

}
