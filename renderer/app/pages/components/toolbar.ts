import { Channels } from '../../common/channels';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-toolbar',
  templateUrl: 'toolbar.html',
  styleUrls: ['toolbar.scss']
})

export class ToolbarComponent {

  /** ctor */
  constructor(public electron: ElectronService) { }

  /** Open dev tools */
  devTools(): void {
    this.electron.ipcRenderer.send(Channels.openDevTools);
  }

  /** Reload app */
  reload(): void {
    this.electron.ipcRenderer.send(Channels.reload);
  }

}
