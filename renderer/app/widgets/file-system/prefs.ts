import { DestroyService } from '../../services/destroy';
import { Dictionary } from '../../state/file-system/prefs';
import { FileSystemPrefsState } from '../../state/file-system/prefs';
import { Scope } from '../../state/file-system/prefs';
import { SelectionState } from '../../state/selection';
import { TabsState } from '../../state/tabs';
import { Widget } from '../widget';
import { WidgetPrefs } from '../widget-prefs';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';

import { map } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [DestroyService],
  selector: 'ternimal-file-system-prefs',
  templateUrl: 'prefs.html',
  styleUrls: ['prefs.scss']
})

export class FileSystemPrefsComponent implements OnInit, WidgetPrefs {

  prefsForm: FormGroup;

  size = 259673;
  today = Date.now();

  @Input() widget: Widget;

  constructor(private destroy$: DestroyService,
              private formBuilder: FormBuilder,
              public prefs: FileSystemPrefsState,
              public tabs: TabsState,
              private selection: SelectionState) { 
    this.prefsForm = this.formBuilder.group({
      dateFormat: null,
      quantityFormat: null,
      root: null,
      showHiddenFiles: null,
      sortDirectories: null,
      timeFormat: null,
      visibility: this.formBuilder.group(this.prefs.dictionary.reduce((acc, dict) => {
        acc[dict.name] = new FormControl({ value: null, disabled: dict.name === 'name' });
        return acc;
      }, { }))
    });
  }

  ngOnInit(): void {
    this.populate();
    this.prefsForm.valueChanges
      .pipe(
        // NOTE: name is always visible
        map(prefsForm => ({ ...prefsForm, 
          visibility: { ...prefsForm.visibility, name: true }})),
        takeUntil(this.destroy$)
      )
      .subscribe(prefsForm => {
        const layoutID = (this.prefs.scope === 'byLayoutID') ? this.selection.layoutID : null;
        const splitID = (this.prefs.scope === 'bySplitID') ? this.selection.splitID : null;
        this.prefs.update({ prefs: prefsForm, layoutID, splitID });
      });
  }

  rescope(scope: Scope): void {
    if (scope !== this.prefs.scope) {
      this.prefs.rescope({ scope });
      this.populate();
    }
  }

  trackByDict(_, dict: Dictionary): string {
    return dict.name;
  }

  // private methods

  private populate(): void {
    const prefs = this.prefs[this.prefs.scope];
    this.prefsForm.patchValue({
      dateFormat: prefs.dateFormat,
      quantityFormat: prefs.quantityFormat,
      root: prefs.root,
      showHiddenFiles: prefs.showHiddenFiles,
      sortDirectories: prefs.sortDirectories,
      timeFormat: prefs.timeFormat,
      visibility: this.prefs.dictionary.reduce((acc, dict) => {
        acc[dict.name] = prefs.visibility[dict.name];
        return acc;
      }, { })
    }, { emitEvent: false });
  }

}
