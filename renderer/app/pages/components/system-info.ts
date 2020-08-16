import { Channels } from '../../common/channels';
import { DestroyService } from '../../services/destroy';
import { Params } from '../../services/params';
import { SystemInfo } from '../../common/system-info';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { OnInit } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { timer } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  selector: 'ternimal-system-info',
  templateUrl: 'system-info.html',
  styleUrls: ['system-info.scss']
})
export class SystemInfoComponent implements OnInit {
  systemInfo: SystemInfo;

  constructor(
    private destroy$: DestroyService,
    public electron: ElectronService,
    private params: Params
  ) {}

  ngOnInit(): void {
    this.pollSystemInfo$();
  }

  // private methods

  private pollSystemInfo$(): void {
    timer(0, this.params.systemInfoPollInterval)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.systemInfo = this.electron.ipcRenderer.sendSync(
          Channels.systemInfo
        );
      });
  }
}
