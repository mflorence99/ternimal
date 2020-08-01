import { Channels } from '../common/channels';
import { Params } from '../services/params';
import { ProcessDescriptor } from '../common/process-list';
import { ProcessList } from '../common/process-list';
import { Utils } from '../services/utils';

import { DataAction } from '@ngxs-labs/data/decorators';
import { ElectronService } from 'ngx-electron';
import { Injectable } from '@angular/core';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { NgxsOnInit } from '@ngxs/store';
import { Payload } from '@ngxs-labs/data/decorators';
import { State } from '@ngxs/store';
import { StateRepository } from '@ngxs-labs/data/decorators';

import { timer } from 'rxjs';

interface DataActionParams {
  processList: ProcessList
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

export type ProcessesStateModel = ProcessStats[];

@Injectable({ providedIn: 'root' })
@StateRepository()
@State<ProcessesStateModel>({
  name: 'processes',
  defaults: [ ]
})

export class ProcessesState extends NgxsDataRepository<ProcessesStateModel> implements NgxsOnInit {

  private accrueCPU;
  private accrueMemory;
  private polling = false;

  constructor(public electron: ElectronService,
              private params: Params,
              private utils: Utils) {  
    super();
    this.accrueCPU = this.accrue('cpu');
    this.accrueMemory = this.accrue('memory');
  }

  // actions

  @DataAction({ insideZone: true })
  update(@Payload('ProcessesState.update') { processList }: DataActionParams): void {
    const processes = processList.map((ps: ProcessDescriptor): ProcessStats => {
      return {
        ...ps,
        cpuTimeline: this.accrueCPU(ps),
        memoryTimeline: this.accrueMemory(ps)
      };
    });
    this.ctx.setState(processes);
  }

  /* eslint-disable @typescript-eslint/member-ordering */

  ngxsOnInit(): void {
    super.ngxsOnInit(); 
    this.rcvProcessList$();
  }

  startPolling(): void {
    if (!this.polling) {
      this.pollProcessList$();
      this.polling = true;
    }
  }

  // private methods

  private accrue(attr: string): Function {
    const timelines: Record<string, Timeline> = { };
    const indexes: Record<string, number> = { };
    const numPoints = this.params.processList.maxTimeline / this.params.processList.pollInterval;
    // perform actual accrual
    return (ps: ProcessDescriptor): Timeline => {
      let timeline = timelines[ps.pid];
      // initialize the timeline
      if (!timeline) {
        timeline = {
          data: new Array(numPoints).fill(null),
          labels: new Array(numPoints).fill(null)
        };
        timelines[ps.pid] = timeline;
        indexes[ps.pid] = 0;
      }
      // populate the timeline
      timeline.data[indexes[ps.pid]] = ps[attr];
      timeline.labels[indexes[ps.pid]] = String(ps.timestamp);
      // prepare for the next iteration
      if (++indexes[ps.pid] >= numPoints) {
        timeline.data.shift();
        timeline.labels.shift();
        indexes[ps.pid] -= 1;
      }
      return this.utils.deepCopy(timeline);
    };
  }

  private pollProcessList$(): void {
    timer(0, this.params.processList.pollInterval)
      .subscribe(() => {
        this.electron.ipcRenderer.send(Channels.processListRequest);
      });
  }

  private rcvProcessList$(): void {
    this.electron.ipcRenderer.on(Channels.processListResponse, (_, processList: ProcessList) => {
      this.update({ processList });
    });
  }

}
