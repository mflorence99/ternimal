import { Channels } from '../../common';
import { Layout } from '../../state/layout';
import { LayoutState } from '../../state/layout';
import { PanesState } from '../../state/panes';
import { Params } from '../../services/params';
import { ProcessDescriptor } from '../../common';
import { ProcessList } from '../../common';
import { Utils } from '../../services/utils';

import { DataAction } from '@ngxs-labs/data/decorators';
import { ElectronService } from 'ngx-electron';
import { Injectable } from '@angular/core';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { NgxsOnInit } from '@ngxs/store';
import { Payload } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';

import { filter } from 'rxjs/operators';
import { timer } from 'rxjs';

interface DataActionParams {
  processList: ProcessList;
}

interface Timeline {
  data: number[];
  labels: string[];
}

export interface ProcessStats {
  cmd: string;
  cpu: number;
  cpuTimeline: Timeline;
  ctime: number;
  elapsed: number;
  memory: number;
  memoryTimeline: Timeline;
  name: string;
  pid: number;
  ppid: number;
  uid: string;
}

export type ProcessListStateModel = ProcessStats[];

@Injectable({ providedIn: 'root' })
@StateRepository()
@State<ProcessListStateModel>({
  name: 'processList',
  defaults: []
})
export class ProcessListState
  extends NgxsDataRepository<ProcessListStateModel>
  implements NgxsOnInit {
  private accrueCPU;
  private accrueMemory;

  constructor(
    public electron: ElectronService,
    public layout: LayoutState,
    public panes: PanesState,
    public params: Params,
    private utils: Utils
  ) {
    super();
    this.accrueCPU = this.accrue('cpu');
    this.accrueMemory = this.accrue('memory');
  }

  // actions

  @DataAction({ insideZone: true })
  update(
    @Payload('ProcessListState.update') { processList }: DataActionParams
  ): void {
    const processes = processList.map(
      (ps: ProcessDescriptor): ProcessStats => {
        return {
          ...ps,
          cpuTimeline: this.accrueCPU(ps),
          memoryTimeline: this.accrueMemory(ps)
        };
      }
    );
    this.ctx.setState(processes);
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  ngxsOnInit(): void {
    super.ngxsOnInit();
    this.pollProcessList$();
    this.rcvProcessList$();
  }

  // private methods

  private accrue(attr: string): Function {
    const timelines: Record<string, Timeline> = {};
    const indexes: Record<string, number> = {};
    // perform actual accrual
    return (ps: ProcessDescriptor): Timeline => {
      // NOTE: why do this here rather than up in the closure?
      // because we want to override the number of points in tests
      const numPoints =
        this.params.processList.maxTimeline /
        this.params.processList.pollInterval;
      let timeline = timelines[ps.pid];
      // initialize the timeline
      if (!timeline) {
        timeline = {
          data: new Array(numPoints).fill(NaN),
          labels: new Array(numPoints).fill(null)
        };
        timelines[ps.pid] = timeline;
        indexes[ps.pid] = 0;
      }
      // populate the timeline
      timeline.data[indexes[ps.pid]] = ps[attr];
      timeline.labels[indexes[ps.pid]] = String(ps.timestamp);
      // prepare for the next iteration
      if (++indexes[ps.pid] > numPoints) {
        timeline.data.shift();
        timeline.labels.shift();
        indexes[ps.pid] -= 1;
      }
      return this.utils.deepCopy(timeline);
    };
  }

  private anyListeners(): boolean {
    return this.layout.someSplit(
      this.layout.layout,
      (split: Layout): boolean =>
        this.panes.prefs(split.id).widget === 'ProcessListComponent'
    );
  }

  private pollProcessList$(): void {
    timer(0, this.params.processList.pollInterval)
      .pipe(filter(() => this.anyListeners()))
      .subscribe(() => {
        this.electron.ipcRenderer.send(Channels.processListRequest);
      });
  }

  private rcvProcessList$(): void {
    this.electron.ipcRenderer.on(
      Channels.processListResponse,
      (_, processList: ProcessList) => {
        this.update({ processList });
      }
    );
  }
}
