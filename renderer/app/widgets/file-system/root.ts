import { Dictionary } from '../../state/file-system/prefs';
import { FileDescriptor } from '../../common/file-system';
import { FileSystemFilesState } from '../../state/file-system/files';
import { FileSystemPrefs } from '../../state/file-system/prefs';
import { FileSystemPrefsState } from '../../state/file-system/prefs';
import { TabsState } from '../../state/tabs';
import { Widget } from '../widget';
import { WidgetLaunch } from '../widget';
import { WidgetPrefs } from '../widget';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-file-system-root',
  templateUrl: 'root.html',
  styleUrls: ['root.scss']
})

export class FileSystemComponent implements OnInit, Widget {

  currentPrefs: FileSystemPrefs;

  @Input() splitID: string;

  widgetLaunch: WidgetLaunch = {
    description: 'File System',
    icon: ['fas', 'database'],
    implementation: 'FileSystemComponent'
  };

  widgetPrefs: WidgetPrefs = {
    description: 'File System setup',
    implementation: 'FileSystemPrefsComponent'
  };

  constructor(public files: FileSystemFilesState,
              public prefs: FileSystemPrefsState,
              public tabs: TabsState) { }

  ngOnInit(): void {
    this.currentPrefs = this.prefs.currentPrefs(this.tabs.tab.layoutID, this.splitID);
    // TODO:
    this.files.loadPaths([this.currentPrefs.initialPath]);
  }

  trackByDesc(_, desc: FileDescriptor): string {
    return desc.path;
  }

  trackByDict(_, dict: Dictionary): string {
    return dict.name;
  }

}
