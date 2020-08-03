import { Channels } from '../../common/channels';
import { ColumnSort } from '../../state/sort';
import { ConfirmDialogComponent } from '../../components/confirm-dialog';
import { ConfirmDialogModel } from '../../components/confirm-dialog';
import { DestroyService } from '../../services/destroy';
import { Params } from '../../services/params';
import { ProcessListState } from '../../state/processes/process-list';
import { ProcessStats } from '../../state/processes/process-list';
import { SortState } from '../../state/sort';
import { TableComponent } from '../../components/table';
import { Utils } from '../../services/utils';
import { Widget } from '../widget';
import { WidgetCommand } from '../widget';
import { WidgetLaunch } from '../widget';

import { Actions } from '@ngxs/store';
import { AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { delay } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [DestroyService],
  selector: 'ternimal-processes-root',
  templateUrl: 'root.html',
  styleUrls: ['root.scss']
})

export class ProcessListComponent implements AfterViewInit, OnInit, Widget {

  columnSort: ColumnSort;

  commands: WidgetCommand[] = [
    {
      command: 'run(false)',
      icon: ['far', 'pause-circle'],
      if: 'running',
      tooltip: 'Pause'
    },
    {
      command: 'run(true)',
      icon: ['far', 'play-circle'],
      tooltip: 'Run',
      unless: 'running'
    }
  ];

  launch: WidgetLaunch = {
    description: 'top+',
    icon: ['fas', 'sitemap'],
    implementation: 'ProcessListComponent'
  };

  menuItems: WidgetCommand[] = [
    {
      command: 'confirmKill()',
      icon: ['far', 'pause-circle'],
      if: 'table.selectedRows.length',
      tooltip: 'Kill...'
    }
  ];

  running = true;

  @Input() splitID: string;

  stats: ProcessStats[];

  @ViewChild(TableComponent, { static: true }) table: TableComponent;

  constructor(private actions$: Actions,
              private destroy$: DestroyService,
              private dialog: MatDialog,
              public electron: ElectronService,
              private params: Params,
              public processList: ProcessListState,
              private snackBar: MatSnackBar,
              public sort: SortState,
              private utils: Utils) { }

  confirmKill(): void {
    const message = 'Are you sure you want to proceed? All selected processes will be killed, which may result in system instability.';
    const title = 'Confirm Kill Processes';
    this.dialog.open(ConfirmDialogComponent, {
      data: new ConfirmDialogModel(title, message)
    }).afterClosed().subscribe(result => {
      if (result)
        this.kill();
    });
  }

  kill(): void {
    // NOTE: the row ID is the PID
    const pids = this.table.selectedRows;
    this.electron.ipcRenderer.send(Channels.processListKill, pids);
    const message = `Killed process${pids.length === 1 ? '' : 'es'} ${pids.join(', ')}`;
    this.snackBar.open(message, null, { duration: this.params.snackBarDuration });
  }

  ngAfterViewInit(): void {
    this.handleActions$();
    this.handleSort$();
    this.processList.startPolling();
  }

  ngOnInit(): void {
    this.columnSort = this.sort.columnSort(this.splitID);
    this.stats = this.sortStats(this.processList.snapshot);
  }

  run(running: boolean): void {
    this.running = running;
    this.snackBar.open('Process list display', (running ? 'Running' : 'Paused'), {
      duration: this.params.snackBarDuration
    });
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
          return this.utils.hasProperty(action, 'ProcessListState.update')
            && (status === 'SUCCESSFUL');
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.stats = this.sortStats(this.processList.snapshot));
  }

  private handleSort$(): void {
    this.table.sortedColumn$
      .pipe(
        // @see https://blog.angular-university.io/angular-debugging/
        delay(0),
        takeUntil(this.destroy$)
      )
      .subscribe(columnSort => {
        this.columnSort = columnSort;
        this.sort.update({ splitID: this.splitID, columnSort });
        // resort that stats
        this.stats = this.sortStats(this.processList.snapshot);
      });
  }

  private sortStats(stats: ProcessStats[]): ProcessStats[] {
    if (this.columnSort.sortDir === 0)
      return stats;
    else return stats
      .slice(0)
      .sort((p, q): number => {
        const nm = this.columnSort.sortedID;
        let order = 0;
        if (['name', 'uid'].includes(nm))
          order = p[nm].toLowerCase().localeCompare(q[nm].toLowerCase());
        else order = p[nm] - q[nm];
        return order * this.columnSort.sortDir;
      });
  }

}
