import { DestroyService } from '../../services/destroy';
import { Dictionary } from '../../state/prefs';
import { ProcessListPrefsState } from '../../state/processes/prefs';
import { Scope } from '../../state/prefs';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  selector: 'ternimal-processes-prefs',
  templateUrl: 'prefs.html',
  styleUrls: ['../prefs.scss']
})
export class ProcessListPrefsComponent implements OnInit, WidgetPrefs {
  prefsForm: FormGroup;

  @Input() widget: Widget;

  constructor(
    private destroy$: DestroyService,
    private formBuilder: FormBuilder,
    public prefs: ProcessListPrefsState,
    public tabs: TabsState,
    private selection: SelectionState
  ) {
    this.prefsForm = this.formBuilder.group({
      showSparkline: null,
      timeFormat: null,
      visibility: this.formBuilder.group(
        this.prefs.dictionary.reduce((acc, dict) => {
          acc[dict.name] = new FormControl({
            value: null,
            disabled: dict.name === 'pid'
          });
          return acc;
        }, {})
      )
    });
  }

  ngOnInit(): void {
    this.populate();
    this.handleValueChanges$();
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

  private handleValueChanges$(): void {
    this.prefsForm.valueChanges
      .pipe(
        // NOTE: name is always visible
        map((prefsForm) => ({
          ...prefsForm,
          visibility: { ...prefsForm.visibility, pid: true }
        })),
        takeUntil(this.destroy$)
      )
      .subscribe((prefsForm) => {
        const layoutID =
          this.prefs.scope === 'byLayoutID' ? this.selection.layoutID : null;
        const splitID =
          this.prefs.scope === 'bySplitID' ? this.selection.splitID : null;
        this.prefs.update({ prefs: prefsForm, layoutID, splitID });
      });
  }

  private populate(): void {
    const prefs = this.prefs[this.prefs.scope];
    this.prefsForm.patchValue(
      {
        showSparkline: prefs.showSparkline,
        timeFormat: prefs.timeFormat,
        visibility: this.prefs.dictionary.reduce((acc, dict) => {
          acc[dict.name] = prefs.visibility?.[dict.name];
          return acc;
        }, {})
      },
      { emitEvent: false }
    );
  }
}
