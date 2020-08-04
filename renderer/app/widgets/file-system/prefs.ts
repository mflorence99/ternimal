import { DestroyService } from '../../services/destroy';
import { FileSystemPrefsState } from '../../state/file-system/prefs';
import { TabsState } from '../../state/tabs';
import { Widget } from '../widget';
import { WidgetPrefs } from '../widget-prefs';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [DestroyService],
  selector: 'ternimal-file-system-prefs',
  templateUrl: 'prefs.html',
  styleUrls: ['prefs.scss']
})

export class FileSystemPrefsComponent implements OnInit, WidgetPrefs {

  atLeastOne = true;

  prefsForm: FormGroup;

  size = 259673;
  today = Date.now();

  @Input() widget: Widget;

  constructor(private destroy$: DestroyService,
              private formBuilder: FormBuilder,
              public prefs: FileSystemPrefsState,
              public tabs: TabsState) { 
    this.prefsForm = this.formBuilder.group({
      prefs: this.formBuilder.group({
        dateFormat: [this.prefs.global.dateFormat, Validators.required],
        quantityFormat: [this.prefs.global.quantityFormat, Validators.required],
        showHiddenFiles: [this.prefs.global.showHiddenFiles, Validators.required],
        sortDirectories: [this.prefs.global.sortDirectories, Validators.required],
        timeFormat: [this.prefs.global.timeFormat, Validators.required],
        visibility: this.formBuilder.group(this.prefs.dictionary.reduce((acc, dict) => {
          acc[dict.name] = [this.prefs.global.visibility[dict.name]];
          return acc;
        }, { }))
      })
    });
  }

  ngOnInit(): void {
    this.prefsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(prefsForm => {
        this.atLeastOne = true;
        if (Object.values(prefsForm.prefs.visibility).some(vis => vis))
          this.prefs.update({ prefs: prefsForm.prefs });
        else this.atLeastOne = false;
      });
  }

}
