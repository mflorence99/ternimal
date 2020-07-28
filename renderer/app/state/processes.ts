import { Channels } from '../common/channels';
import { Params } from '../services/params';
import { ProcessDescriptor } from '../common/process-list';
import { ProcessList } from '../common/process-list';

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

interface DataPoint {
  x: number;
  y: number;
}

export interface Processes {
  cmd: string;
  cpu: DataPoint[];
  ctime: number;
  elapsed: number;
  memory: DataPoint[];
  name: string;
  pid: number;
  ppid: number;
}

export type ProcessesStateModel = Processes[];

@Injectable({ providedIn: 'root' })
@StateRepository()
@State<ProcessesStateModel>({
  name: 'processes',
  defaults: [ ]
})

export class ProcessesState extends NgxsDataRepository<ProcessesStateModel> implements NgxsOnInit {

  private accrueCPU;
  private accrueMemory;

  constructor(public electron: ElectronService,
              private params: Params) {  
    super();
    this.accrueCPU = this.accrue('cpu');
    this.accrueMemory = this.accrue('memory');
  }

  // actions

  @DataAction({ insideZone: true })
  update(@Payload('ProcessesState.update') { processList }: DataActionParams): void {
    const processes = processList.map((ps: ProcessDescriptor) => {
      return {
        ...ps,
        cpu: this.accrueCPU(ps),
        memory: this.accrueMemory(ps)
      };
    });
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
    const acc: Record<string, DataPoint[]> = { };
    return (ps: ProcessDescriptor): DataPoint[] => {
      let accrued = acc[ps.pid];
      if (!accrued) {
        accrued = [];
        acc[ps.pid] = accrued;
      }
      accrued.push({ x: ps.timestamp, y: ps[attr] });
      // NOTE: only keep N minutes of data
      while ((ps.timestamp - accrued[0].x) > this.params.processList.maxTimeline)
        accrued.shift();
      return [...accrued];
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
