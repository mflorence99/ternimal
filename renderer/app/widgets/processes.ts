import { ColumnSort } from '../components/table';
import { DestroyService } from '../services/destroy';
import { ProcessesState } from '../state/processes';
import { ProcessStats } from '../state/processes';
import { TableComponent } from '../components/table';
import { Utils } from '../services/utils';

import { Actions } from '@ngxs/store';
import { AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { ViewChild } from '@angular/core';

import { delay } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [DestroyService],
  selector: 'ternimal-processes',
  templateUrl: 'processes.html',
  styleUrls: ['processes.scss']
})

export class ProcessesComponent implements AfterViewInit, OnDestroy {

  stats: ProcessStats[] = [];

  @ViewChild(TableComponent, { static: true }) table: TableComponent;

  private columnSort: ColumnSort = { sortDir: 0 };

  constructor(private actions$: Actions,
              private destroy$: DestroyService,
              public processes: ProcessesState,
              private utils: Utils) { 
    this.handleActions$();
  }

  ngAfterViewInit(): void {
    this.processes.startPolling();
    this.table.sortedColumn$
      .pipe(
        // @see https://blog.angular-university.io/angular-debugging/
        delay(0),
        takeUntil(this.destroy$)
      )
      .subscribe(columnSort => {
        this.columnSort = columnSort;
        this.stats = this.sortStats(this.processes.snapshot);
      });
  }

  ngOnDestroy(): void {
    this.processes.stopPolling();
  }

  trackByPID(_, process): string {
    return String(process.pid);
  }

  // private methods

  private handleActions$(): void {
    this.actions$
      .pipe(
        filter(({ action, status }) => {
          return this.utils.hasProperty(action, 'ProcessesState.update')
            && (status === 'SUCCESSFUL');
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.stats = this.sortStats(this.processes.snapshot));
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
