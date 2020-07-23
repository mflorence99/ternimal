import { DestroyService } from '../../services/destroy';
import { SelectionState } from '../../state/selection';
import { Tab } from '../../state/tabs';
import { TabsState } from '../../state/tabs';

import { ApplicationRef } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [DestroyService],
  selector: 'ternimal-tab-prefs',
  templateUrl: 'tab-prefs.html',
  styleUrls: ['tab-prefs.scss']
})

export class TabPrefsComponent implements OnInit {

  tabPrefsForm: FormGroup;

  /** ctor */
  constructor(private app: ApplicationRef,
              private destroy$: DestroyService,
              private formBuilder: FormBuilder,
              public tabs: TabsState,
              private selection: SelectionState) { 
    this.tabPrefsForm = this.formBuilder.group({
      color: [this.tabs.tab.color, Validators.required],
      icon: [this.tabs.tab.icon, Validators.required],
      label: [this.tabs.tab.label, Validators.required]
    });
  }

  /** Clear form contents */
  clear(nm: string): void {
    this.tabPrefsForm.patchValue({ [nm]: '' });
  }

  /** When we're ready */
  ngOnInit(): void {
    this.tabPrefsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((tabPrefsForm: Tab) => {
        this.tabs.updateTab({ tab: { ...tabPrefsForm, layoutID: this.selection.layoutID } });
        this.app.tick();
      });
  }

}
