import { Params } from '../services/params';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { ResizeObserverEntry } from 'ngx-resize-observer';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-eq-gauge',
  templateUrl: 'eq-gauge.html',
  styleUrls: ['eq-gauge.scss']
})

export class EqGaugeComponent {

  count: number;

  @Input() tag: string;
  @Input() value: number;

  /** ctor */
  constructor(public params: Params) { }

  /** Color LED */
  color(ix: number): string {
    const ratio = ix / this.count;
    if (ratio > this.value)
      return 'var(--mat-grey-800)';
    else if (ratio > 0.66)
      return this.params.led.red;
    else if (ratio > 0.33)
      return this.params.led.yellow;
    else return this.params.led.green;
  }

  /** Handle resize of gauge */
  handleResize(resize: ResizeObserverEntry): void {
    this.count = Math.trunc((resize.contentRect.width + this.params.led.gap) 
      / (this.params.led.gap + this.params.led.width));
  }

}