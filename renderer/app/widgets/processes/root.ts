import { Channels } from '../../common';
import { ConfirmDialogComponent } from '../../components/confirm-dialog';
import { ConfirmDialogModel } from '../../components/confirm-dialog';
import { DestroyService } from '../../services/destroy';
import { Dictionary } from '../../state/prefs';
import { Params } from '../../services/params';
import { ProcessListPrefs } from '../../state/processes/prefs';
import { ProcessListPrefsState } from '../../state/processes/prefs';
import { ProcessListState } from '../../state/processes/list';
import { ProcessStats } from '../../state/processes/list';
import { SortState } from '../../state/sort';
import { StatusState } from '../../state/status';
import { TableComponent } from '../../components/table';
import { TabsState } from '../../state/tabs';
import { Widget } from '../widget';
import { WidgetCommand } from '../widget';
import { WidgetLaunch } from '../widget';
import { WidgetPrefs } from '../widget';
import { WidgetStatus } from '../widget';

import { Actions } from '@ngxs/store';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { debounceTime } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  selector: 'ternimal-processes-root',
  templateUrl: 'root.html',
  styleUrls: ['root.scss']
})
export class ProcessListComponent implements OnInit, Widget {
  effectivePrefs: ProcessListPrefs;
  running = true;

  @Input() splitID: string;

  stats: ProcessStats[];

  @ViewChild(TableComponent, { static: true }) table: TableComponent;

  tableID = 'process-list';

  widgetCommands: WidgetCommand[] = [
    {
      command: 'run(false)',
      description: 'Pause',
      icon: ['far', 'pause-circle'],
      if: 'running'
    },
    {
      command: 'run(true)',
      description: 'Run',
      icon: ['far', 'play-circle'],
      unless: 'running'
    }
  ];

  widgetLaunch: WidgetLaunch = {
    description: 'Process List',
    icon: ['fas', 'sitemap'],
    implementation: 'ProcessListComponent'
  };

  widgetMenuItems: WidgetCommand[][] = [
    [
      {
        command: 'confirmKill()',
        description: 'Kill...',
        if: 'table.selectedRowIDs.length'
      }
    ]
  ];

  widgetPrefs: WidgetPrefs = {
    description: 'Process List setup',
    implementation: 'ProcessListPrefsComponent'
  };

  widgetStatus: WidgetStatus = {
    showSearch: true
  };

  constructor(
    private actions$: Actions,
    private cdf: ChangeDetectorRef,
    private destroy$: DestroyService,
    private dialog: MatDialog,
    public electron: ElectronService,
    private params: Params,
    public prefs: ProcessListPrefsState,
    public processList: ProcessListState,
    private snackBar: MatSnackBar,
    public sort: SortState,
    public status: StatusState,
    public tabs: TabsState
  ) {}

  confirmKill(): void {
    const message =
      'Are you sure you want to proceed? All selected processes will be killed, which may result in system instability.';
    const title = 'Confirm Kill Processes';
    this.dialog
      .open(ConfirmDialogComponent, {
        data: new ConfirmDialogModel(title, message)
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.kill();
      });
  }

  kill(): void {
    // NOTE: the row ID is the PID
    const pids = this.table.selectedRowIDs;
    this.electron.ipcRenderer.send(Channels.processListKill, pids);
    const message = `Killed process${pids.length === 1 ? '' : 'es'} ${pids.join(
      ', '
    )}`;
    this.snackBar.open(message, null, {
      duration: this.params.snackBarDuration
    });
  }

  ngOnInit(): void {
    this.effectivePrefs = this.prefs.effectivePrefs(
      this.tabs.tab.layoutID,
      this.splitID
    );
    this.stats = this.sortem(this.searchem(this.processList.snapshot));
    this.handleActions$();
  }

  run(running: boolean): void {
    this.running = running;
    this.snackBar.open('Process list display', running ? 'Running' : 'Paused', {
      duration: this.params.snackBarDuration
    });
  }

  trackByDict(_, dict: Dictionary): string {
    return dict.name;
  }

  trackByPID(_, process): string {
    return String(process.pid);
  }

  // private methods

  private handleActions$(): void {
    this.actions$
      .pipe(
        filter(() => this.running),
        filter(({ action, status }) => {
          return (
            (action['ProcessListState.update'] ||
              (action['PrefsState.update'] &&
                !action['PrefsState.update'].splitID) ||
              action['PrefsState.update']?.splitID === this.splitID ||
              action['SortState.update']?.splitID === this.splitID ||
              action['StatusState.update']?.splitID === this.splitID) &&
            status === 'SUCCESSFUL'
          );
        }),
        debounceTime(0),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.effectivePrefs = this.prefs.effectivePrefs(
          this.tabs.tab.layoutID,
          this.splitID
        );
        this.stats = this.sortem(this.searchem(this.processList.snapshot));
        this.cdf.markForCheck();
      });
  }

  private searchem(stats: ProcessStats[]): ProcessStats[] {
    const meta = this.prefs.dictionary.filter(
      (dict) => dict.isSearchable && this.effectivePrefs.visibility[dict.name]
    );
    return stats.filter((stat) => {
      const matchees = meta.map((dict) => stat[dict.name]);
      return this.status.match(
        this.splitID,
        this.widgetLaunch.implementation,
        matchees
      );
    });
  }

  private sortem(stats: ProcessStats[]): ProcessStats[] {
    const columnSort = this.sort.columnSort(this.splitID, this.tableID);
    const dict = this.prefs.dictionary.find(
      (dict) => dict.name === (columnSort.sortedID ?? 'name')
    );
    return stats.slice(0).sort((p: any, q: any): number => {
      if (dict.isNumber)
        return (p[dict.name] - q[dict.name]) * columnSort.sortDir;
      else
        return (
          p[dict.name].toLowerCase().localeCompare(q[dict.name].toLowerCase()) *
          columnSort.sortDir
        );
    });
  }
}
