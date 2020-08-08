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
  propsForm: FormGroup;

  @Input() widget: Widget;

  constructor(private destroy$: DestroyService,
              private formBuilder: FormBuilder,
              public ternimal: TernimalState) {
    // TODO: only showing props for one 
    this.desc = this.ternimal.widgetSidebarCtx[0];
    this.propsForm = this.formBuilder.group({
      name: null
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
      name: this.desc.name
    }, { emitEvent: false });
  }

}
