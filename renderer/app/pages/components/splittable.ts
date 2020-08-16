import { Layout } from '../../state/layout';
import { LayoutState } from '../../state/layout';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { SplitComponent } from 'angular-split';
import { ViewChild } from '@angular/core';

import { debounceTime } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ternimal-splittable',
  templateUrl: 'splittable.html',
  styleUrls: ['splittable.scss']
})
export class SplittableComponent implements OnInit {
  @Input() splittable: Layout;

  @ViewChild(SplitComponent, { static: true }) splitter: SplitComponent;

  constructor(public layout: LayoutState) {}

  ngOnInit(): void {
    this.handleDragProgress$();
  }

  trackBySplitID(_, split: Layout): string {
    return split.id;
  }

  // private methods

  private handleDragProgress$(): void {
    this.splitter.dragProgress$
      .pipe(debounceTime(1000))
      .subscribe(({ sizes }) => {
        this.layout.updateSplit({ splitID: this.splittable.id, sizes });
      });
  }
}
