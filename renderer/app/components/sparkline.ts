import { Params } from '../services/params';
import { Utils } from '../services/utils';

import { AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Input } from '@angular/core';
import { ViewChild } from '@angular/core';

import Chart from 'chart.js';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-sparkline',
  templateUrl: 'sparkline.html',
  styleUrls: ['sparkline.scss']
})

export class SparklineComponent implements AfterViewInit {

  /* eslint-disable @typescript-eslint/member-ordering */

  chart: Chart;
  @Input() 
  get sparkline(): any[] {
    return this._sparkline;
  }
  set sparkline(data: any[]) {
    this._sparkline = data;
    if (this.chart) {
      const dataset = this.chart.data.datasets[0];
      dataset.backgroundColor = this.utils.colorOf(this.host, this.color(), 0.25);
      dataset.borderColor = this.utils.colorOf(this.host, this.color(), 1);
      dataset.data = this.sparkline;
      this.chart.update();
    }
  }

  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  @ViewChild('wrapper', { static: true }) wrapper: ElementRef;

  private _sparkline: any[] = [];

  constructor(private host: ElementRef,
              private params: Params,
              private utils: Utils) { }

  ngAfterViewInit(): void {
    const canvas = this.canvas.nativeElement;
    canvas.height = this.wrapper.nativeElement.offsetHeight;
    canvas.width = this.wrapper.nativeElement.offsetWidth;
    const ctx = canvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          data: []
        }]
      },
      options: {
        responsive: false,
        legend: {
          display: false
        },
        elements: {
          line: {
            borderWidth: 1
          },
          point: {
            radius: 0
          }
        },
        tooltips: {
          enabled: false
        },
        scales: {
          yAxes: [
            {
              display: false,
              ticks: { suggestedMin: 0, suggestedMax: 100 }
            }
          ],
          xAxes: [
            {
              display: false
            }
          ]
        }
      }
    });

  }

  // private methods

  private color(): string {
    const value = this.sparkline[this.sparkline.length - 1].y;
    if (value > 66)
      return this.params.rgb.red;
    else if (value > 33)
      return this.params.rgb.yellow;
    else return this.params.rgb.green;
  }

}
