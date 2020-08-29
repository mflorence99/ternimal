import { Channels } from '../../common';
import { DestroyService } from '../../services/destroy';
import { Dictionary } from '../../state/prefs';
import { Params } from '../../services/params';
import { Scope } from '../../state/prefs';
import { SelectionState } from '../../state/selection';
import { TabsState } from '../../state/tabs';
import { TerminalPrefsState } from '../../state/terminal/prefs';
import { TerminalPreviewComponent } from './preview';
import { Widget } from '../widget';
import { WidgetPrefs } from '../widget-prefs';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElectronService } from 'ngx-electron';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayRef } from '@angular/cdk/overlay';

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
  cursors = ['block', 'underline', 'bar'];
  fonts: string[];
  overlayRef: OverlayRef;
  prefsForm: FormGroup;
  renderers = ['dom', 'canvas'];
  themes: string[];
  weights = [
    'normal',
    'bold',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900'
  ];

  @Input() widget: Widget;

  constructor(
    private destroy$: DestroyService,
    public electron: ElectronService,
    private formBuilder: FormBuilder,
    private overlay: Overlay,
    public params: Params,
    public prefs: TerminalPrefsState,
    public tabs: TabsState,
    private selection: SelectionState
  ) {
    this.prefsForm = this.formBuilder.group({
      cursorBlink: null,
      cursorStyle: null,
      cursorWidth: null,
      fontFamily: null,
      fontSize: null,
      fontWeight: null,
      fontWeightBold: null,
      letterSpacing: null,
      lineHeight: null,
      rendererType: null,
      scrollSensitivity: null,
      scrollback: null,
      theme: null
    });
  }

  ngOnInit(): void {
    this.loadFontList();
    this.loadThemesList();
    this.populate();
    this.handleValueChanges$();
    this.setupOverlay();
  }

  rescope(scope: Scope): void {
    if (scope !== this.prefs.scope) {
      this.prefs.rescope({ scope });
      this.populate();
    }
  }

  showSnapshot(snapshot: string): void {
    this.overlayRef.updatePositionStrategy(
      this.overlay.position().global().centerHorizontally().centerVertically()
    );
    const previewer = this.overlayRef.attach(
      new ComponentPortal(TerminalPreviewComponent)
    ).instance;
    previewer.snapshot = snapshot;
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

  private loadFontList(): void {
    this.fonts = this.electron.ipcRenderer.sendSync(Channels.getAvailableFonts);
  }

  private loadThemesList(): void {
    this.themes = this.electron.ipcRenderer.sendSync(
      Channels.getAvailableThemes
    );
  }

  private populate(): void {
    const prefs = this.prefs[this.prefs.scope];
    this.prefsForm.patchValue(
      {
        cursorBlink: prefs.cursorBlink,
        cursorStyle: prefs.cursorStyle,
        cursorWidth: prefs.cursorWidth,
        fontFamily: prefs.fontFamily,
        fontSize: prefs.fontSize,
        fontWeight: prefs.fontWeight,
        fontWeightBold: prefs.fontWeightBold,
        letterSpacing: prefs.letterSpacing,
        lineHeight: prefs.lineHeight,
        rendererType: prefs.rendererType,
        scrollSensitivity: prefs.scrollSensitivity,
        scrollback: prefs.scrollback,
        theme: prefs.theme
      },
      { emitEvent: false }
    );
  }

  private setupOverlay(): void {
    this.overlayRef = this.overlay.create({ hasBackdrop: true });
    this.overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.overlayRef.detach();
      });
  }
}
