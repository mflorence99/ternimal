import { Channels } from '../../common';
import { ConfirmDialogComponent } from '../../components/confirm-dialog';
import { ConfirmDialogModel } from '../../components/confirm-dialog';
import { DestroyService } from '../../services/destroy';
import { Params } from '../../services/params';
import { ProcessListState } from '../../state/processes/list';
import { ProcessStats } from '../../state/processes/list';
import { SortState } from '../../state/sort';
import { TableComponent } from '../../components/table';
import { Widget } from '../widget';
import { WidgetCommand } from '../widget';
import { WidgetLaunch } from '../widget';

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
    description: 'top+',
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

  constructor(
    private actions$: Actions,
    private cdf: ChangeDetectorRef,
    private destroy$: DestroyService,
    private dialog: MatDialog,
    public electron: ElectronService,
    private params: Params,
    public processList: ProcessListState,
    private snackBar: MatSnackBar,
    public sort: SortState
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
    this.stats = this.sortem(this.processList.snapshot);
    this.handleActions$();
    this.processList.startPolling();
  }

  run(running: boolean): void {
    this.running = running;
    this.snackBar.open('Process list display', running ? 'Running' : 'Paused', {
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
          return (
            (action['ProcessListState.update'] ||
              action['SortState.update']?.splitID === this.splitID) &&
            status === 'SUCCESSFUL'
          );
        }),
        debounceTime(0),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.stats = this.sortem(this.processList.snapshot);
        this.cdf.markForCheck();
      });
  }

  private sortem(stats: ProcessStats[]): ProcessStats[] {
    const columnSort = this.sort.columnSort(this.splitID, this.tableID);
    if (columnSort.sortDir === 0) return stats;
    else
      return stats.slice(0).sort((p, q): number => {
        const nm = columnSort.sortedID;
        let order = 0;
        if (['name', 'uid'].includes(nm))
          order = p[nm].toLowerCase().localeCompare(q[nm].toLowerCase());
        else order = p[nm] - q[nm];
        return order * columnSort.sortDir;
      });
  }
}
