import { ParsedPath } from '../../common/file-system';

import { AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
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
  newName$ = new Subject<string>();
  @Input() parsedPath: ParsedPath;

  accept(): void {
    this.newName$.next(this.input.nativeElement.value);
    this.newName$.complete();
  }

  cancel(): void {
    this.newName$.next(null);
    this.newName$.complete();
  }

  ngAfterViewInit(): void {
    this.input.nativeElement.focus();
    this.input.nativeElement.setSelectionRange(0, this.parsedPath.name.length);
  }

  ngOnDestroy(): void {
    this.newName$.complete();
  }
}
