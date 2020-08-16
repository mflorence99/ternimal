import { Channels } from '../../../common/channels';
import { LayoutState } from '../state/layout';
import { TernimalState } from '../state/ternimal';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OnInit } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ternimal-root',
  templateUrl: 'root.html',
  styleUrls: ['root.scss']
})
export class RootComponent implements OnInit {
  //
  constructor(
    public electron: ElectronService,
    public layout: LayoutState,
    private snackBar: MatSnackBar,
    public ternimal: TernimalState
  ) {}

  ngOnInit(): void {
    this.rcvError$();
  }

  // private methods

  private rcvError$(): void {
    this.electron.ipcRenderer.on(Channels.error, (_, message) => {
      this.snackBar.open(message, 'OK');
    });
  }
}
