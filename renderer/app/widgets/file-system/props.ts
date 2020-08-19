import { AnalysisByExt } from '../../common';
import { Channels } from '../../common';
import { Chmod } from '../../common';
import { DestroyService } from '../../services/destroy';
import { FileDescriptor } from '../../common';
import { TernimalState } from '../../state/ternimal';
import { Utils } from '../../services/utils';
import { Widget } from '../widget';
import { WidgetPrefs } from '../widget-prefs';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';

import { takeUntil } from 'rxjs/operators';

import Chart from 'chart.js';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  selector: 'ternimal-file-system-props',
  templateUrl: 'props.html',
  styleUrls: ['props.scss']
})
export class FileSystemPropsComponent implements OnInit, WidgetPrefs {
  chart: Chart;
  desc: FileDescriptor;
  descs: FileDescriptor[];
  flags = ['read', 'write', 'execute'];
  perms = [
    ['owner', 'Owner'],
    ['group', 'Group'],
    ['others', 'Others']
  ];
  propsForm: FormGroup;

  @Input() widget: Widget;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild('canvas', { static: true }) canvas: ElementRef;
  @ViewChild('wrapper', { static: true }) wrapper: ElementRef;

  constructor(
    private destroy$: DestroyService,
    public electron: ElectronService,
    private formBuilder: FormBuilder,
    private host: ElementRef,
    public ternimal: TernimalState,
    private utils: Utils
  ) {
    this.desc = this.ternimal.widgetSidebarCtx[0];
    this.descs = this.ternimal.widgetSidebarCtx;
    this.propsForm = this.formBuilder.group({
      owner: this.formBuilder.group({
        read: null,
        write: null,
        execute: null
      }),
      group: this.formBuilder.group({
        read: null,
        write: null,
        execute: null
      }),
      others: this.formBuilder.group({
        read: null,
        write: null,
        execute: null
      })
    });
  }

  ngOnInit(): void {
    this.initChart();
    this.populate();
    const paths = this.descs.map((desc) => desc.path);
    this.handleValueChanges$(paths);
    if (this.descs.length > 1 || this.desc.isDirectory) this.rcvAnalyze$(paths);
  }

  // private methods

  private handleValueChanges$(paths: string[]): void {
    this.propsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((chmod: Chmod) => {
        this.electron.ipcRenderer.send(Channels.fsChmod, paths, chmod);
      });
  }

  private initChart(): void {
    const canvas = this.canvas.nativeElement;
    canvas.height = this.wrapper.nativeElement.offsetHeight;
    canvas.width = this.wrapper.nativeElement.offsetWidth;
    const ctx = canvas.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [
          {
            backgroundColor: [],
            borderWidth: 0,
            data: []
          }
        ]
      },
      options: {
        responsive: false,
        legend: {
          display: false
        },
        tooltips: {
          enabled: true
        }
      }
    });
  }

  private populate(): void {
    this.propsForm.patchValue(
      {
        owner: {
          read: this.union(1, 'r'),
          write: this.union(2, 'w'),
          execute: this.union(3, 'x')
        },
        group: {
          read: this.union(4, 'r'),
          write: this.union(5, 'w'),
          execute: this.union(6, 'x')
        },
        others: {
          read: this.union(7, 'r'),
          write: this.union(8, 'w'),
          execute: this.union(9, 'x')
        }
      } as Chmod,
      { emitEvent: false }
    );
  }

  private rcvAnalyze$(paths: string[]): void {
    this.electron.ipcRenderer.send(Channels.fsAnalyze, paths);
    this.electron.ipcRenderer.once(
      Channels.fsAnalyzeCompleted,
      (_, analysis: AnalysisByExt) => {
        console.log(analysis);
        // TODO: temporary
        const colors = Object.values(analysis).map((val) =>
          this.utils.colorOf(this.host, val.color, 1)
        );
        const data = Object.values(analysis).map((val) => val.count);
        const labels = Object.keys(analysis);
        this.chart.data.datasets[0].backgroundColor = colors;
        this.chart.data.datasets[0].data = data;
        this.chart.data.labels = labels;
        this.chart.update();
      }
    );
  }

  private union(ix: number, f: string): boolean {
    if (this.descs.every((desc) => desc.mode[ix] === f)) return true;
    else if (this.descs.every((desc) => desc.mode[ix] === '-')) return false;
    else return null;
  }
}
