import { Params } from '../services/params';
import { Utils } from '../services/utils';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import Chart from 'chart.js';

interface Sparkline {
  data: number[];
  labels: string[];
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ternimal-sparkline',
  templateUrl: 'sparkline.html',
  styleUrls: ['sparkline.scss']
})
export class SparklineComponent implements OnInit {
  /* eslint-disable @typescript-eslint/member-ordering */

  chart: Chart;
  @Input()
  get sparkline(): Sparkline {
    return this._sparkline;
  }
  set sparkline(data: Sparkline) {
    this._sparkline = data;
    this.updateChart();
  }

  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  @ViewChild('wrapper', { static: true }) wrapper: ElementRef;

  private _sparkline: Sparkline;

  constructor(
    private host: ElementRef,
    private params: Params,
    private utils: Utils
  ) {}

  ngOnInit(): void {
    const canvas = this.canvas.nativeElement;
    canvas.height = this.wrapper.nativeElement.offsetHeight;
    canvas.width = this.wrapper.nativeElement.offsetWidth;
    const ctx = canvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            backgroundColor: this.utils.colorOf(
              this.host,
              this.params.rgb.green,
              0.25
            ),
            borderColor: this.utils.colorOf(
              this.host,
              this.params.rgb.green,
              1
            ),
            data: []
          },
          {
            backgroundColor: this.utils.colorOf(
              this.host,
              this.params.rgb.yellow,
              0.25
            ),
            borderColor: this.utils.colorOf(
              this.host,
              this.params.rgb.yellow,
              1
            ),
            data: []
          },
          {
            backgroundColor: this.utils.colorOf(
              this.host,
              this.params.rgb.red,
              0.25
            ),
            borderColor: this.utils.colorOf(this.host, this.params.rgb.red, 1),
            data: []
          }
        ]
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
    // set the initial data
    this.updateChart();
  }

  // private methods

  private updateChart(): void {
    if (this.chart && this.sparkline) {
      this.chart.data.labels = this.sparkline.labels;
      const green = new Array(this.sparkline.data.length).fill(NaN);
      const yellow = new Array(this.sparkline.data.length).fill(NaN);
      const red = new Array(this.sparkline.data.length).fill(NaN);
      this.sparkline.data.forEach((value, ix) => {
        if (value > 66) red[ix] = value;
        else if (value > 33) yellow[ix] = value;
        else green[ix] = value;
      });
      this.chart.data.datasets[0].data = green;
      this.chart.data.datasets[1].data = yellow;
      this.chart.data.datasets[2].data = red;
      this.chart.update();
    }
  }
}
