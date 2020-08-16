import { Params } from '../services/params';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { ResizeObserverEntry } from 'ngx-resize-observer';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ternimal-eq-gauge',
  templateUrl: 'eq-gauge.html',
  styleUrls: ['eq-gauge.scss']
})
export class EqGaugeComponent {
  count: number;

  @Input() tag: string;
  @Input() value: number;

  constructor(public params: Params) {}

  color(ix: number): string {
    const ratio = ix / this.count;
    if (ratio > this.value) return 'var(--mat-grey-800)';
    else if (ratio > 0.66) return `var(${this.params.rgb.red})`;
    else if (ratio > 0.33) return `var(${this.params.rgb.yellow})`;
    else return `var(${this.params.rgb.green})`;
  }

  handleResize(resize: ResizeObserverEntry): void {
    this.count = Math.trunc(
      (resize.contentRect.width + this.params.led.gap) /
        (this.params.led.gap + this.params.led.width)
    );
  }
}
