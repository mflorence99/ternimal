import { Channels } from '../../common/channels';
import { DestroyService } from '../../services/destroy';
import { Params } from '../../services/params';
import { SystemInfo } from '../../common/system-info';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';

import { takeUntil } from 'rxjs/operators';
import { timer } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [DestroyService],
  selector: 'ternimal-info',
  templateUrl: 'info.html',
  styleUrls: ['info.scss']
})

export class InfoComponent {

  systemInfo: SystemInfo;

  /** ctor */
  constructor(private destroy$: DestroyService,
              public electron: ElectronService,
              private params: Params) { 
    this.pollSystemInfo$();
  }

  // private methods

  private pollSystemInfo$(): void {
    timer(this.params.systemInfoPollInterval, this.params.systemInfoPollInterval)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.systemInfo = this.electron.ipcRenderer.sendSync(Channels.systemInfo);
      });
  }

}
