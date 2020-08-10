import { DestroyService } from '../../services/destroy';
import { Dictionary } from '../../state/file-system/prefs';
import { FileDescriptor } from '../../common/file-system';
import { FileSystemFilesState } from '../../state/file-system/files';
import { FileSystemPathsState } from '../../state/file-system/paths';
import { FileSystemPrefs } from '../../state/file-system/prefs';
import { FileSystemPrefsState } from '../../state/file-system/prefs';
import { Params } from '../../services/params';
import { SortState } from '../../state/sort';
import { StatusState } from '../../state/status';
import { TableComponent } from '../../components/table';
import { TabsState } from '../../state/tabs';
import { TernimalState } from '../../state/ternimal';
import { Widget } from '../widget';
import { WidgetCommand } from '../widget';
import { WidgetLaunch } from '../widget';
import { WidgetPrefs } from '../widget';

import { Actions } from '@ngxs/store';
import { AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

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
  loading: Record<string, boolean> = { };

  @Input() splitID: string;

  @ViewChild(TableComponent, { static: true }) table: TableComponent;

  tableID = 'file-system';

  widgetLaunch: WidgetLaunch = {
    description: 'File System',
    icon: ['fas', 'database'],
    implementation: 'FileSystemComponent'
  };

  widgetMenuItems: WidgetCommand[][] = [
    [
      {
        command: 'gotoRoot()',
        description: 'Go to /',
        unless: 'atRoot()'
      },
      {
        command: 'gotoParent()',
        description: 'Go to parent',
        unless: 'atRoot()'
      },
      {
        command: 'gotoHome()',
        description: 'Go to $HOME',
        unless: 'atHome()'
      },
      {
        command: 'gotoHere()',
        description: 'Go to here'
      }
    ],
    [
      {
        command: 'props()',
        description: 'Properties...',
        if: 'table.selectedRowIDs.length'
      }
    ]
  ];

  widgetPrefs: WidgetPrefs = {
    description: 'File System setup',
    implementation: 'FileSystemPrefsComponent'
  };

  constructor(private actions$: Actions,
              private destroy$: DestroyService,
              public files: FileSystemFilesState,
              public paths: FileSystemPathsState,
              public prefs: FileSystemPrefsState,
              public sort: SortState,
              public status: StatusState,
              public tabs: TabsState,
              public ternimal: TernimalState) { }

  atHome(): boolean {
    return this.effectivePrefs.root === Params.homeDir;
  }

  atRoot(): boolean {
    return this.effectivePrefs.root === Params.rootDir;
  }

  gotoHere(): void {
    this.goto(this.table.selectedRowIDs[0]);
  }

  gotoHome(): void {
    this.goto(Params.homeDir);
  }

  gotoParent(): void {
    const path = this.effectivePrefs.root;
    const ix = path.lastIndexOf(Params.pathSeparator);
    let parent = path.substring(0, ix);
    // TODO: Windows ??
    if (parent.length === 0)
      parent = Params.rootDir;
    else if (parent.length === 1)
      parent = '/home';
    this.goto(parent);
  }

  gotoRoot(): void {
    this.goto(Params.rootDir);
  }

  level(desc: FileDescriptor): number {
    let root = this.effectivePrefs.root;
    if (!root.endsWith(Params.pathSeparator))
      root += Params.pathSeparator;
    const ix = root.length;
    const parts = desc.path.substring(ix).split(Params.pathSeparator);
    // NOTE: a non-directory has one more part that we don't want to indent extra for
    return parts.length - 1 - (desc.isDirectory ? 0 : 1);
  }

  loadPath(path: string): void {
    if (!this.loading[path]) {
      if (!this.paths.isOpen(this.splitID, path)) {
        this.files.loadPaths([path]);
        this.paths.open({ splitID: this.splitID, path });
      } else this.paths.close({ splitID: this.splitID, path });
    }
  }

  ngAfterViewInit(): void {
    this.handleActions$();
    this.handleLoading$();
  }

  ngOnInit(): void {
    this.loadEm(this.paths.snapshot[this.splitID] ?? []);
  }

  props(): void {
    this.ternimal.showWidgetSidebar({ implementation: 'FileSystemPropsComponent', context: this.files.descsForPaths(this.table.selectedRowIDs) });
  }

  trackByDesc(_, desc: FileDescriptor): string {
    return desc.path;
  }

  trackByDict(_, dict: Dictionary): string {
    return dict.name;
  }

  // private methods

  private assemble(descs: FileDescriptor[]): FileDescriptor[] {
    const showHidden = this.effectivePrefs.showHiddenFiles;
    const filtered = showHidden ? descs : descs.filter(desc => !desc.name.startsWith('.'));
    let assembled = this.sortEm(filtered);
    const paths = this.paths.snapshot[this.splitID] ?? [];
    for (let ix = 0; ix < assembled.length; ix++) {
      const desc = assembled[ix];
      if (desc.isDirectory && paths.includes(desc.path)) {
        const inner = this.assemble(this.files.snapshot[desc.path] ?? []);
        // NOTE: this supposedly slower: assembled.splice(ix + 1, 0, ...inner);
        assembled = assembled.slice(0, ix + 1).concat(inner).concat(assembled.slice(ix + 1));
        ix += inner.length;
      }
    }
    return assembled;
  }

  private goto(path: string): void {
    this.files.loadPaths([path]);
    this.paths.open({ splitID: this.splitID, path });
    this.prefs.update({ splitID: this.splitID, prefs: { root: path } });
    this.status.update({ splitID: this.splitID, widgetID: this.widgetLaunch.implementation, status: { cwd: path } });
  }

  private handleActions$(): void {
    this.actions$
      .pipe(
        filter(({ action, status }) => {
          // TODO: only paths this indtance is showing ??
          return (action['FileSystemFilesState.loadPath']
            || (action['FileSystemPathsState.close']?.splitID === this.splitID)
            || (action['FileSystemPathsState.open']?.splitID === this.splitID)
            || (action['FileSystemPrefsState.update']?.splitID == null)
            || (action['FileSystemPrefsState.update']?.splitID === this.splitID)
            || (action['SortState.update']?.splitID === this.splitID))
            && (status === 'SUCCESSFUL');
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.loadEm());
  }

  private handleLoading$(): void {
    this.files.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => Object.assign(this.loading, loading));
  }

  private loadEm(paths?: string[]): void {
    this.effectivePrefs = this.prefs.effectivePrefs(this.tabs.tab.layoutID, this.splitID);
    if (paths)
      // NOTE: always the root as well
      // TODO: no paths above this root??
      this.files.loadPaths([this.effectivePrefs.root, ...paths]);
    this.descs = this.assemble([...this.files.snapshot[this.effectivePrefs.root] ?? []]);
  }

  private sortEm(descs: FileDescriptor[]): FileDescriptor[] {
    if (['first', 'last'].includes(this.effectivePrefs.sortDirectories)) {
      const directories = descs.filter(desc => desc.isDirectory);
      const files = descs.filter(desc => !desc.isDirectory);
      if (this.effectivePrefs.sortDirectories === 'first')
        descs = this.sortEmImpl(directories)
          .concat(this.sortEmImpl(files));
      else if (this.effectivePrefs.sortDirectories === 'last')
        descs = this.sortEmImpl(files)
          .concat(this.sortEmImpl(directories));
    } else this.sortEmImpl(descs);
    return descs;
  }

  private sortEmImpl(descs: FileDescriptor[]): FileDescriptor[] {
    const columnSort = this.sort.columnSort(this.splitID, this.tableID);
    const dict = this.prefs.dictionary.find(dict => dict.name === (columnSort.sortedID ?? 'name'));
    return descs.sort((a: any, b: any) => {
      if (dict.isDate)
        return (a[dict.name].getTime() - b[dict.name].getTime()) * columnSort.sortDir;
      else if (dict.isNumber)
        return (a[dict.name] - b[dict.name]) * columnSort.sortDir;
      else return a[dict.name].toLowerCase().localeCompare(b[dict.name].toLowerCase()) * columnSort.sortDir;
    });
  }

}
