import { DestroyService } from '../../services/destroy';
import { Dictionary } from '../../state/prefs';
import { Params } from '../../services/params';
import { Scope } from '../../state/prefs';
import { SelectionState } from '../../state/selection';
import { TabsState } from '../../state/tabs';
import { TerminalPrefsState } from '../../state/terminal/prefs';
import { Widget } from '../widget';
import { WidgetPrefs } from '../widget-prefs';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';

import { debounceTime } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  selector: 'ternimal-terminal-prefs',
  templateUrl: 'prefs.html',
  styleUrls: ['../prefs.scss']
})
export class TerminalPrefsComponent implements OnInit, WidgetPrefs {
  prefsForm: FormGroup;

  @Input() widget: Widget;

  constructor(
    private destroy$: DestroyService,
    private formBuilder: FormBuilder,
    private params: Params,
    public prefs: TerminalPrefsState,
    public tabs: TabsState,
    private selection: SelectionState
  ) {
    this.prefsForm = this.formBuilder.group({
      fontFamily: null,
      fontSize: null
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
        debounceTime(this.params.prefsDebounceTime),
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
        fontFamily: prefs.fontFamily,
        fontSize: prefs.fontSize
      },
      { emitEvent: false }
    );
  }
}
