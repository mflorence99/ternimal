import { DestroyService } from '../../services/destroy';
import { FileDescriptor } from '../../common/file-system';
import { TernimalState } from '../../state/ternimal';
import { Widget } from '../widget';
import { WidgetPrefs } from '../widget-prefs';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';

import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [DestroyService],
  selector: 'ternimal-file-system-props',
  templateUrl: 'props.html',
  styleUrls: ['props.scss']
})

export class FileSystemPropsComponent implements OnInit, WidgetPrefs {

  desc: FileDescriptor;
  descs: FileDescriptor[];
  flags = ['r', 'w', 'x'];
  perms = [
    ['u', 'Owner'],
    ['g', 'Group'],
    ['o', 'Others']
  ];
  propsForm: FormGroup;

  @Input() widget: Widget;

  constructor(private destroy$: DestroyService,
              private formBuilder: FormBuilder,
              public ternimal: TernimalState) {
    this.desc = this.ternimal.widgetSidebarCtx[0];
    this.descs = this.ternimal.widgetSidebarCtx;
    this.propsForm = this.formBuilder.group({
      u: this.formBuilder.group({
        r: null,
        w: null,
        x: null
      }),
      g: this.formBuilder.group({
        r: null,
        w: null,
        x: null
      }),
      o: this.formBuilder.group({
        r: null,
        w: null,
        x: null
      }),
    });
  }

  ngOnInit(): void {
    this.populate();
    this.propsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(console.log);
  }

  // private methods

  private populate(): void {
    this.propsForm.patchValue({
      u: {
        r: this.descs.every(desc => desc.mode[1] === 'r') || null,
        w: this.descs.every(desc => desc.mode[2] === 'w') || null,
        x: this.descs.every(desc => desc.mode[3] === 'x') || null
      },
      g: {
        r: this.descs.every(desc => desc.mode[4] === 'r') || null,
        w: this.descs.every(desc => desc.mode[5] === 'w') || null,
        x: this.descs.every(desc => desc.mode[6] === 'x') || null
      },
      o: {
        r: this.descs.every(desc => desc.mode[7] === 'r') || null,
        w: this.descs.every(desc => desc.mode[8] === 'w') || null,
        x: this.descs.every(desc => desc.mode[9] === 'x') || null
      }
    }, { emitEvent: false });
  }

}
