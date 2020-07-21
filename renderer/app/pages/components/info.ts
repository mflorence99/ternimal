import { Channels } from '../../common/channels';
import { SystemInfo } from '../../common/system-info';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-info',
  templateUrl: 'info.html',
  styleUrls: ['info.scss']
})

export class InfoComponent {

  systemInfo: SystemInfo;

  /** ctor */
  constructor(public electron: ElectronService) { 
    this.electron.ipcRenderer.on(Channels.systemInfo, (_, systemInfo: SystemInfo) => {
      this.systemInfo = systemInfo;
      console.log(systemInfo);
    });
  }

}
