import { ColumnSort } from '../state/sort';
import { DestroyService } from '../services/destroy';
import { ProcessesState } from '../state/processes';
import { ProcessStats } from '../state/processes';
import { SortState } from '../state/sort';
import { TableComponent } from '../components/table';
import { Utils } from '../services/utils';
import { Widget } from './widget';
import { WidgetCommand } from './widget';

import { Actions } from '@ngxs/store';
import { AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
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

export class ProcessesComponent implements AfterViewInit, OnInit, Widget {

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

  menuItems: WidgetCommand[] = [
    {
      command: 'kill()',
      icon: ['far', 'pause-circle'],
      tooltip: 'Kill...'
    }
  ];

  running = true;

  @Input() splitID: string;

  stats: ProcessStats[];

  @ViewChild(TableComponent, { static: true }) table: TableComponent;

  constructor(private actions$: Actions,
              private destroy$: DestroyService,
              public processes: ProcessesState,
              public sort: SortState,
              private utils: Utils) { }

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
        this.sort.update({ splitID: this.splitID, columnSort });
        // resort that stats
        this.stats = this.sortStats(this.processes.snapshot);
      });
  }

  ngOnInit(): void {
    this.handleActions$();
    this.columnSort = this.sort.columnSort(this.splitID);
    this.stats = this.sortStats(this.processes.snapshot);
  }

  run(running: boolean): void {
    this.running = running;
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
          return this.utils.hasProperty(action, 'ProcessesState.update')
            && (status === 'SUCCESSFUL');
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.stats = this.sortStats(this.processes.snapshot);
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
