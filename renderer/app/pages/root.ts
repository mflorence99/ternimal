import { Channels } from '../../../common/channels';
import { LayoutState } from '../state/layout';
import { TernimalState } from '../state/ternimal';

import { AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-root',
  templateUrl: 'root.html',
  styleUrls: ['root.scss']
})

export class RootComponent implements AfterViewInit {

  constructor(public electron: ElectronService,
              public layout: LayoutState,
              private snackBar: MatSnackBar,
              public ternimal: TernimalState) { }

  ngAfterViewInit(): void {
    this.handleError$();      
  }

  // private methods

  private handleError$(): void {
    this.electron.ipcRenderer
      .on(Channels.error, (_, message) => {
        this.snackBar.open(message, 'OK');
      });
  }

}
