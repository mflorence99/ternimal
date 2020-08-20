import { Channels } from '../../../common';
import { DestroyService } from '../services/destroy';
import { LayoutState } from '../state/layout';
import { TernimalState } from '../state/ternimal';
import { Utils } from '../services/utils';

import { Actions } from '@ngxs/store';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OnInit } from '@angular/core';

import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  selector: 'ternimal-root',
  templateUrl: 'root.html',
  styleUrls: ['root.scss']
})
export class RootComponent implements OnInit {
  //
  constructor(
    private actions$: Actions,
    private cdf: ChangeDetectorRef,
    private destroy$: DestroyService,
    public electron: ElectronService,
    public layout: LayoutState,
    private snackBar: MatSnackBar,
    public ternimal: TernimalState,
    private utils: Utils
  ) {}

  ngOnInit(): void {
    this.handleActions$();
    this.rcvError$();
  }

  // private methods

  private handleActions$(): void {
    this.actions$
      .pipe(
        filter(({ action, status }) => {
          return (
            this.utils.hasProperty(action, /^LayoutState\./) &&
            status === 'SUCCESSFUL'
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.cdf.detectChanges();
      });
  }

  private rcvError$(): void {
    // NOTE: because this component is a singleton,
    // we don't have to release this handler
    this.electron.ipcRenderer.on(Channels.error, (_, message) => {
      this.snackBar.open(message, 'OK');
    });
  }
}
