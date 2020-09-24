import { Channels } from '../../common';
import { ConfirmDialogComponent } from '../../components/confirm-dialog';
import { ConfirmDialogModel } from '../../components/confirm-dialog';
import { DestroyService } from '../../services/destroy';
import { Dictionary } from '../../state/prefs';
import { FileDescriptor } from '../../common';
import { FileSystemClipboardState } from '../../state/file-system/clipboard';
import { FileSystemFilesState } from '../../state/file-system/files';
import { FileSystemNewNameComponent } from './new-name';
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
import { WidgetStatus } from '../widget';

import { Actions } from '@ngxs/store';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElectronService } from 'ngx-electron';
import { Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayRef } from '@angular/cdk/overlay';
import { ViewChild } from '@angular/core';

import { filter } from 'rxjs/operators';
import { formatDistanceToNow } from 'date-fns';
import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  selector: 'ternimal-file-system-root',
  templateUrl: 'root.html',
  styleUrls: ['root.scss']
})
export class FileSystemComponent implements OnDestroy, OnInit, Widget {
  descs: FileDescriptor[];
  descsByPath: Record<string, FileDescriptor> = {};
  effectivePrefs: FileSystemPrefs;
  loading: Record<string, boolean> = {};
  overlayRef: OverlayRef;

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
        description: `Go to ${Params.rootDir}`,
        unless: 'atRoot()'
      },
      {
        command: 'gotoParent()',
        description: 'Go to parent',
        unless: 'atRoot()'
      },
      {
        command: 'gotoHome()',
        description: `Go to ${Params.homeDir}`,
        unless: 'atHome()'
      },
      {
        command: 'gotoHere()',
        description: 'Go to here',
        if: 'canGotoHere()'
      }
    ],
    [
      {
        command: 'newFile()',
        description: 'New file...',
        // NOTE: meaning zero or 1 selected
        if: 'table.selectedRowIDs.length < 2'
      },
      {
        command: 'newDir()',
        description: 'New directory...',
        // NOTE: meaning zero or 1 selected
        if: 'table.selectedRowIDs.length < 2'
      },
      {
        accelerator: {
          description: 'F2',
          key: 'F2'
        },
        command: 'rename()',
        description: 'Rename...',
        if: 'table.selectedRowIDs.length ===  1'
      },
      {
        accelerator: {
          ctrlKey: true,
          description: 'Ctrl+Enter',
          key: 'Enter'
        },
        command: 'props()',
        description: 'Properties...',
        if: 'table.selectedRowIDs.length'
      }
    ],
    [
      {
        command: 'touch()',
        description: 'Touch',
        if: 'table.selectedRowIDs.length'
      },
      {
        accelerator: {
          description: 'Backspace',
          key: 'Backspace'
        },
        command: 'trash()',
        description: 'Move to Trash',
        if: 'table.selectedRowIDs.length'
      },
      {
        accelerator: {
          ctrlKey: true,
          description: 'Ctrl+Delete',
          key: 'Delete'
        },
        command: 'confirmDelete()',
        description: 'Permanently delete...',
        if: 'table.selectedRowIDs.length'
      }
    ],
    [
      {
        accelerator: {
          ctrlKey: true,
          description: 'Ctrl+X',
          key: 'x'
        },
        command: 'cutToClipboard()',
        description: 'Cut',
        if: 'table.selectedRowIDs.length'
      },
      {
        accelerator: {
          ctrlKey: true,
          description: 'Ctrl+C',
          key: 'c'
        },
        command: 'copyToClipboard()',
        description: 'Copy',
        if: 'table.selectedRowIDs.length'
      },
      {
        command: 'copyPath()',
        description: 'Copy path',
        if: 'table.selectedRowIDs.length === 1'
      },
      {
        accelerator: {
          ctrlKey: true,
          description: 'Ctrl+V',
          key: 'v'
        },
        command: 'pasteFromClipboard()',
        description: 'Paste',
        if: 'canPasteFromClipboard()'
      },
      {
        command: 'clearClipboard()',
        description: 'Clear clipboard',
        if: 'clipboard.paths.length'
      }
    ]
  ];

  widgetPrefs: WidgetPrefs = {
    description: 'File System setup',
    implementation: 'FileSystemPrefsComponent'
  };

  widgetStatus: WidgetStatus = {
    gotoCWD: 'goto',
    showCWD: true,
    showSearch: false
  };

  private pasteCompletedFn = this.pasteCompleted.bind(this);

  constructor(
    private actions$: Actions,
    private cdf: ChangeDetectorRef,
    public clipboard: FileSystemClipboardState,
    private destroy$: DestroyService,
    private dialog: MatDialog,
    public electron: ElectronService,
    public files: FileSystemFilesState,
    private overlay: Overlay,
    private params: Params,
    public paths: FileSystemPathsState,
    public prefs: FileSystemPrefsState,
    public sort: SortState,
    public status: StatusState,
    public tabs: TabsState,
    public ternimal: TernimalState
  ) {}

  atHome(): boolean {
    return this.effectivePrefs.root === Params.homeDir;
  }

  atRoot(): boolean {
    return this.effectivePrefs.root === Params.rootDir;
  }

  canGotoHere(): boolean {
    if (this.table.selectedRowIDs.length !== 1) return false;
    else {
      const desc = this.descsByPath[this.table.selectedRowIDs[0]];
      return desc?.isDirectory;
    }
  }

  canPasteFromClipboard(): boolean {
    return (
      !this.ternimal.longRunningOp.running &&
      this.clipboard.paths.length > 0 &&
      this.table.selectedRowIDs.length === 1 &&
      !this.clipboard.paths.includes(this.table.selectedRowIDs[0])
    );
  }

  clearClipboard(): void {
    this.clipboard.update({ op: 'clear', paths: [] });
  }

  confirmDelete(): void {
    const message =
      'Are you sure you want to proceed? All selected directories and files will be permanently deleted and they cannot be restored.';
    const title = 'Confirm Permanent Delete';
    this.dialog
      .open(ConfirmDialogComponent, {
        data: new ConfirmDialogModel(title, message)
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.delete();
      });
  }

  copyPath(): void {
    this.electron.ipcRenderer.send(
      Channels.nativeClipboardWrite,
      this.table.selectedRowIDs[0]
    );
  }

  copyToClipboard(): void {
    this.clipboard.update({ op: 'copy', paths: this.table.selectedRowIDs });
  }

  cutToClipboard(): void {
    this.clipboard.update({ op: 'cut', paths: this.table.selectedRowIDs });
  }

  delete(): void {
    this.electron.ipcRenderer.send(
      Channels.fsDelete,
      this.table.selectedRowIDs
    );
  }

  dragStart(event: MouseEvent, path: string): void {
    event.preventDefault();
    this.electron.ipcRenderer.send(Channels.nativeDragStart, path);
  }

  goto(path: string): void {
    this.files.loadPaths([path]);
    this.paths.open({ splitID: this.splitID, path });
    this.prefs.update({ splitID: this.splitID, prefs: { root: path } });
    this.status.update({
      splitID: this.splitID,
      widgetID: this.widgetLaunch.implementation,
      status: { cwd: path }
    });
  }

  gotoHere(): void {
    this.goto(this.table.selectedRowIDs[0]);
  }

  gotoHome(): void {
    this.goto(Params.homeDir);
  }

  gotoParent(): void {
    this.goto(
      this.electron.ipcRenderer.sendSync(
        Channels.fsParentDir,
        this.effectivePrefs.root
      )
    );
  }

  gotoRoot(): void {
    this.goto(Params.rootDir);
  }

  isClipped(path: string): boolean {
    return this.clipboard.paths.includes(path);
  }

  isCut(path: string): boolean {
    return this.isClipped(path) && this.clipboard.op === 'cut';
  }

  isEmpty(path: string): boolean {
    const descs = this.files.snapshot[path];
    if (!descs) return false;
    else if (descs.length === 0) return true;
    // TODO: Windows ??
    else if (!this.effectivePrefs.showHiddenFiles)
      return descs.every((desc) => desc.name.startsWith('.'));
  }

  level(desc: FileDescriptor): number {
    let root = this.effectivePrefs.root;
    if (!root.endsWith(Params.pathSeparator)) root += Params.pathSeparator;
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

  newDir(): void {
    this.newDirOrFile(Channels.fsNewDir);
  }

  newFile(): void {
    this.newDirOrFile(Channels.fsNewFile);
  }

  ngOnDestroy(): void {
    this.electron.ipcRenderer.off(
      Channels.fsCopyCompleted + this.splitID,
      this.pasteCompletedFn
    );
    this.electron.ipcRenderer.off(
      Channels.fsMoveCompleted + this.splitID,
      this.pasteCompletedFn
    );
  }

  ngOnInit(): void {
    this.loadEm(this.paths.snapshot[this.splitID] ?? []);
    this.handleActions$();
    this.handleLoading$();
    this.rcvCompletion$();
    this.setupOverlay();
  }

  open(path: string): void {
    this.electron.ipcRenderer.send(Channels.nativeOpen, path);
  }

  pasteCompleted(_, froms: string[], tos: string[]): void {
    this.clearClipboard();
    // TODO: we have to delay here because the rows we want to
    // select won't exist until the table is redrawn -- and currently
    // we can't detect that
    // so this is an ugly hack
    setTimeout(() => {
      this.table.rowUnselect();
      this.table.rowSelectByIDs(tos);
    }, this.params.fileSystemPasteDelay);
  }

  pasteFromClipboard(): void {
    const channel =
      this.clipboard.op === 'copy' ? Channels.fsCopy : Channels.fsMove;
    this.electron.ipcRenderer.send(
      channel,
      this.splitID,
      this.clipboard.paths,
      this.table.selectedRowIDs[0]
    );
  }

  props(): void {
    this.ternimal.showWidgetSidebar({
      implementation: 'FileSystemPropsComponent',
      context: this.files.descsForPaths(this.table.selectedRowIDs)
    });
  }

  rehydrated(): void {
    this.cdf.markForCheck();
  }

  rename(): void {
    const path = this.table.selectedRowIDs[0];
    const cell = this.table.cellElement(path, 0);
    const newnamer = this.makeNewnamer(path, cell);
    newnamer.newName$.subscribe((name) => {
      if (name) this.electron.ipcRenderer.send(Channels.fsRename, path, name);
      this.overlayRef.detach();
    });
  }

  timeAgo(time: any): string {
    return formatDistanceToNow(time);
  }

  touch(): void {
    this.electron.ipcRenderer.send(Channels.fsTouch, this.table.selectedRowIDs);
  }

  trackByDesc(_, desc: FileDescriptor): string {
    return desc.path;
  }

  trackByDict(_, dict: Dictionary): string {
    return dict.name;
  }

  trash(): void {
    this.electron.ipcRenderer.send(Channels.fsTrash, this.table.selectedRowIDs);
  }

  // private methods

  private assemble(descs: FileDescriptor[]): FileDescriptor[] {
    const showHidden = this.effectivePrefs.showHiddenFiles;
    // TODO: Windows ??
    const filtered = showHidden
      ? descs
      : descs.filter((desc) => !desc.name.startsWith('.'));
    let assembled = this.sortEm(filtered);
    const paths = this.paths.snapshot[this.splitID] ?? [];
    for (let ix = 0; ix < assembled.length; ix++) {
      const desc = assembled[ix];
      this.descsByPath[desc.path] = desc;
      if (desc.isDirectory && paths.includes(desc.path)) {
        const inner = this.assemble(this.files.snapshot[desc.path] ?? []);
        // NOTE: this supposedly slower: assembled.splice(ix + 1, 0, ...inner);
        assembled = assembled
          .slice(0, ix + 1)
          .concat(inner)
          .concat(assembled.slice(ix + 1));
        ix += inner.length;
      }
    }
    return assembled;
  }

  private handleActions$(): void {
    this.actions$
      .pipe(
        filter(({ action, status }) => {
          return (
            (action['FileSystemClipboardState.update'] ||
              action['FileSystemFilesState.loadPath'] ||
              action['FileSystemPathsState.close']?.splitID === this.splitID ||
              action['FileSystemPathsState.open']?.splitID === this.splitID ||
              (action['PrefsState.update'] &&
                !action['PrefsState.update'].splitID) ||
              action['PrefsState.update']?.splitID === this.splitID ||
              action['SortState.update']?.splitID === this.splitID) &&
            status === 'SUCCESSFUL'
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loadEm();
        this.cdf.markForCheck();
      });
  }

  private handleLoading$(): void {
    this.files.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => Object.assign(this.loading, loading));
  }

  private loadEm(paths?: string[]): void {
    this.effectivePrefs = this.prefs.effectivePrefs(
      this.tabs.tab.layoutID,
      this.splitID
    );
    // NOTE: always the root as well
    // TODO: exclude paths above this root??
    if (paths) this.files.loadPaths([this.effectivePrefs.root, ...paths]);
    this.descsByPath = {};
    this.descs = this.assemble([
      ...(this.files.snapshot[this.effectivePrefs.root] ?? [])
    ]);
  }

  private makeNewnamer(
    path: string,
    cell: HTMLElement,
    nobase = false
  ): FileSystemNewNameComponent {
    const rect = cell.getBoundingClientRect();
    this.overlayRef.updatePositionStrategy(
      this.overlay
        .position()
        .global()
        .width(`${rect.width}px`)
        .left(`${rect.left}px`)
        .height(`${rect.height}px`)
        .top(`${rect.top}px`)
    );
    const newnamer = this.overlayRef.attach(
      new ComponentPortal(FileSystemNewNameComponent)
    ).instance;
    const parsedPath = this.electron.ipcRenderer.sendSync(
      Channels.fsParsePath,
      path
    );
    // TODO: only when we are renaming do we have a base name to
    // disambiguate against
    if (nobase) {
      parsedPath.base = '';
      parsedPath.ext = '';
      parsedPath.name = '';
    }
    newnamer.parsedPath = parsedPath;
    return newnamer;
  }

  private newDirOrFile(op: Channels): void {
    const path = this.table.selectedRowIDs[0] ?? this.effectivePrefs.root;
    const cell =
      path !== this.effectivePrefs.root
        ? this.table.cellElement(path, 0)
        : this.table.cellElement(this.descs[this.descs.length - 1].path, 0);
    const desc = this.descsByPath[path];
    const cpath =
      !desc || desc.isDirectory ? `${path}${Params.pathSeparator}dummy` : path;
    const newnamer = this.makeNewnamer(cpath, cell, /* nobase = */ true);
    newnamer.newName$.subscribe((name) => {
      if (name) {
        this.electron.ipcRenderer.send(op, cpath, name);
        if (desc?.isDirectory) {
          this.files.loadPaths([path]);
          this.paths.open({ splitID: this.splitID, path });
        }
      }
      this.overlayRef.detach();
    });
  }

  private rcvCompletion$(): void {
    this.electron.ipcRenderer.on(
      Channels.fsCopyCompleted + this.splitID,
      this.pasteCompletedFn
    );
    this.electron.ipcRenderer.on(
      Channels.fsMoveCompleted + this.splitID,
      this.pasteCompletedFn
    );
  }

  private setupOverlay(): void {
    this.overlayRef = this.overlay.create({ hasBackdrop: true });
    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.overlayRef.detach();
      });
  }

  private sortEm(descs: FileDescriptor[]): FileDescriptor[] {
    if (['first', 'last'].includes(this.effectivePrefs.sortDirectories)) {
      const directories = descs.filter((desc) => desc.isDirectory);
      const files = descs.filter((desc) => !desc.isDirectory);
      if (this.effectivePrefs.sortDirectories === 'first')
        descs = this.sortEmImpl(directories).concat(this.sortEmImpl(files));
      else if (this.effectivePrefs.sortDirectories === 'last')
        descs = this.sortEmImpl(files).concat(this.sortEmImpl(directories));
    } else this.sortEmImpl(descs);
    return descs;
  }

  private sortEmImpl(descs: FileDescriptor[]): FileDescriptor[] {
    const columnSort = this.sort.columnSort(this.splitID, this.tableID);
    const dict = this.prefs.dictionary.find(
      (dict) => dict.name === (columnSort.sortedID ?? 'name')
    );
    return descs.sort((p: any, q: any) => {
      if (dict.isDate)
        return (
          (p[dict.name].getTime() - q[dict.name].getTime()) * columnSort.sortDir
        );
      else if (dict.isNumber)
        return (p[dict.name] - q[dict.name]) * columnSort.sortDir;
      else
        return (
          p[dict.name].toLowerCase().localeCompare(q[dict.name].toLowerCase()) *
          columnSort.sortDir
        );
    });
  }
}
