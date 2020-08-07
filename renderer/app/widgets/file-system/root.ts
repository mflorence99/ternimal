import { DestroyService } from '../../services/destroy';
import { Dictionary } from '../../state/file-system/prefs';
import { FileDescriptor } from '../../common/file-system';
import { FileSystemFilesState } from '../../state/file-system/files';
import { FileSystemPrefs } from '../../state/file-system/prefs';
import { FileSystemPrefsState } from '../../state/file-system/prefs';
import { SortState } from '../../state/sort';
import { TabsState } from '../../state/tabs';
import { Widget } from '../widget';
import { WidgetLaunch } from '../widget';
import { WidgetPrefs } from '../widget';

import { Actions } from '@ngxs/store';
import { AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';

import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [DestroyService],
  selector: 'ternimal-file-system-root',
  templateUrl: 'root.html',
  styleUrls: ['root.scss']
})

export class FileSystemComponent implements AfterViewInit, OnInit, Widget {

  descs: FileDescriptor[];
  effectivePrefs: FileSystemPrefs;

  @Input() splitID: string;

  tableID = 'file-system';

  widgetLaunch: WidgetLaunch = {
    description: 'File System',
    icon: ['fas', 'database'],
    implementation: 'FileSystemComponent'
  };

  widgetPrefs: WidgetPrefs = {
    description: 'File System setup',
    implementation: 'FileSystemPrefsComponent'
  };

  constructor(private actions$: Actions,
              private destroy$: DestroyService,
              public files: FileSystemFilesState,
              public prefs: FileSystemPrefsState,
              public sort: SortState,
              public tabs: TabsState) { }

  ngAfterViewInit(): void {
    this.handleActions$();
  }

  ngOnInit(): void {
    // TODO: temporary
    this.effectivePrefs = this.prefs.effectivePrefs(this.tabs.tab.layoutID, this.splitID);
    this.files.loadPaths([this.effectivePrefs.root]);
    this.descs = [];
  }

  trackByDesc(_, desc: FileDescriptor): string {
    return desc.path;
  }

  trackByDict(_, dict: Dictionary): string {
    return dict.name;
  }

  // private methods

  private handleActions$(): void {
    this.actions$
      .pipe(
        filter(({ action, status }) => {
          return (action['FileSystemFilesState.loadPath']
            || (action['SortState.update']?.splitID === this.splitID))
            && (status === 'SUCCESSFUL');
        }),
        takeUntil(this.destroy$)
      )
      // TODO: temporary
      .subscribe(() => this.descs = [...this.files.snapshot[this.effectivePrefs.root]]);
  }

}
