import { Channels } from '../../common/channels';
import { Params } from '../../services/params';
import { ParsedPath } from '../../common/file-system';

import { AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ElementRef } from '@angular/core';
import { Input } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ViewChild } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-file-system-new-name',
  templateUrl: 'new-name.html',
  styleUrls: ['new-name.scss']
})
export class FileSystemNewNameComponent implements AfterViewInit, OnDestroy {
  @ViewChild('input', { static: true }) input: ElementRef;
  invalid: string = null;
  newName$ = new Subject<string>();
  @Input() parsedPath: ParsedPath;

  constructor(public electron: ElectronService) {}

  accept(): void {
    const newName = this.input.nativeElement.value;
    if (!this.invalid && newName !== this.parsedPath.base) {
      this.newName$.next(newName);
      this.newName$.complete();
    } else this.cancel();
  }

  cancel(): void {
    this.newName$.next(null);
    this.newName$.complete();
  }

  newName(nm: string): void {
    const path = `${this.parsedPath.dir}${Params.pathSeparator}${nm}`;
    this.invalid =
      nm !== this.parsedPath.base &&
      this.electron.ipcRenderer.sendSync(Channels.fsExists, path)
        ? nm
        : null;
  }

  ngAfterViewInit(): void {
    this.input.nativeElement.focus();
    this.input.nativeElement.setSelectionRange(0, this.parsedPath.name.length);
  }

  ngOnDestroy(): void {
    this.newName$.complete();
  }
}
