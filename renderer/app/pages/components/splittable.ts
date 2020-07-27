import { Layout } from '../../state/layout';
import { LayoutState } from '../../state/layout';

import { AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { SplitComponent } from 'angular-split';
import { ViewChild } from '@angular/core';

import { debounceTime } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-splittable',
  templateUrl: 'splittable.html',
  styleUrls: ['splittable.scss']
})

export class SplittableComponent implements AfterViewInit {

  @Input() splittable: Layout;

  @ViewChild(SplitComponent, { static: true }) splitter: SplitComponent;

  constructor(public layout: LayoutState) { }

  ngAfterViewInit(): void {
    this.splitter.dragProgress$
      .pipe(debounceTime(1000))
      .subscribe(({ sizes }) => {
        this.layout.updateSplit({ splitID: this.splittable.id, sizes });
      });
  }

}
