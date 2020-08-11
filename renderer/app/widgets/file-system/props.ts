import { Channels } from '../../common/channels';
import { Chmod } from '../../common/chmod';
import { DestroyService } from '../../services/destroy';
import { FileDescriptor } from '../../common/file-system';
import { TernimalState } from '../../state/ternimal';
import { Widget } from '../widget';
import { WidgetPrefs } from '../widget-prefs';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
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
  flags = ['read', 'write', 'execute'];
  perms = [
    ['owner', 'Owner'],
    ['group', 'Group'],
    ['others', 'Others']
  ];
  propsForm: FormGroup;

  @Input() widget: Widget;

  constructor(private destroy$: DestroyService,
              public electron: ElectronService,
              private formBuilder: FormBuilder,
              public ternimal: TernimalState) {
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
      }),
    });
  }

  ngOnInit(): void {
    this.populate();
    this.propsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((chmod: Chmod) => {
        this.electron.ipcRenderer.send(Channels.fsChmod, this.descs, chmod);
      });
  }

  // private methods

  private populate(): void {
    this.propsForm.patchValue({
      owner: {
        read: this.descs.every(desc => desc.mode[1] === 'r') || null,
        write: this.descs.every(desc => desc.mode[2] === 'w') || null,
        execute: this.descs.every(desc => desc.mode[3] === 'x') || null
      },
      group: {
        read: this.descs.every(desc => desc.mode[4] === 'r') || null,
        write: this.descs.every(desc => desc.mode[5] === 'w') || null,
        execute: this.descs.every(desc => desc.mode[6] === 'x') || null
      },
      others: {
        read: this.descs.every(desc => desc.mode[7] === 'r') || null,
        write: this.descs.every(desc => desc.mode[8] === 'w') || null,
        execute: this.descs.every(desc => desc.mode[9] === 'x') || null
      }
    } as Chmod, { emitEvent: false });
  }

}
