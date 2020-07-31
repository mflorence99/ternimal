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
import { ViewChild } from '@angular/core';

import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [DestroyService],
  selector: 'ternimal-processes',
  templateUrl: 'processes.html',
  styleUrls: ['processes.scss']
})

export class ProcessesComponent implements AfterViewInit {

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
    this.table.sortedColumn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(columnSort => {
        this.columnSort = columnSort;
        this.stats = this.sortStats(this.processes.snapshot);
      });
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
        else if (['cpu', 'memory'].includes(nm))
          order = p[nm][p[nm].length - 1].y - q[nm][q[nm].length - 1].y;
        else order = p[nm] - q[nm];
        return order * this.columnSort.sortDir;
      });
  }

}
