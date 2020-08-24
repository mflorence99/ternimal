import { DestroyService } from '../../services/destroy';
import { TabsState } from '../../state/tabs';
import { TerminalPrefs } from '../../state/terminal/prefs';
import { TerminalPrefsState } from '../../state/terminal/prefs';
import { Widget } from '../widget';
import { WidgetLaunch } from '../widget';
import { WidgetPrefs } from '../widget';

import { Actions } from '@ngxs/store';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import { FitAddon } from 'xterm-addon-fit';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { SearchAddon } from 'xterm-addon-search';
import { Terminal } from 'xterm';
import { ViewChild } from '@angular/core';
import { WebLinksAddon } from 'xterm-addon-web-links';

import { debounceTime } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  templateUrl: 'root.html',
  selector: 'ternimal-terminal-root',
  styleUrls: ['root.scss']
})
export class TerminalComponent implements OnInit, Widget {
  effectivePrefs: TerminalPrefs;
  @ViewChild('renderer', { static: true }) renderer: ElementRef;

  @Input() splitID: string;

  widgetLaunch: WidgetLaunch = {
    description: 'Terminal',
    icon: ['fas', 'laptop-code'],
    implementation: 'TerminalComponent'
  };

  widgetPrefs: WidgetPrefs = {
    description: 'Terminal setup',
    implementation: 'TerminalPrefsComponent'
  };

  private fitAddon: FitAddon;
  private terminal: Terminal;

  constructor(
    private actions$: Actions,
    private cdf: ChangeDetectorRef,
    private destroy$: DestroyService,
    public prefs: TerminalPrefsState,
    public tabs: TabsState
  ) {}

  handleResize(): void {
    // NOTE: this roundabout way seems to eliminate the flicker
    // that plain fit() generates
    const { cols, rows } = this.fitAddon.proposeDimensions();
    this.terminal.resize(cols, rows);
  }

  ngOnInit(): void {
    this.handleActions$();
    this.setupTerminal();
  }

  // private methods

  private adjustTerminal(): void {
    this.effectivePrefs = this.prefs.effectivePrefs(
      this.tabs.tab.layoutID,
      this.splitID
    );
    this.terminal.setOption('cursorBlink', this.effectivePrefs.cursorBlink);
    this.terminal.setOption('cursorStyle', this.effectivePrefs.cursorStyle);
    this.terminal.setOption('cursorWidth', this.effectivePrefs.cursorWidth);
    this.terminal.setOption('fontFamily', this.effectivePrefs.fontFamily);
    this.terminal.setOption('fontSize', this.effectivePrefs.fontSize);
    this.terminal.setOption('fontWeight', this.effectivePrefs.fontWeight);
    this.terminal.setOption(
      'fontWeightBold',
      this.effectivePrefs.fontWeightBold
    );
    this.terminal.setOption('letterSpacing', this.effectivePrefs.letterSpacing);
    this.terminal.setOption('lineHeight', this.effectivePrefs.lineHeight);
    this.terminal.setOption('rendererType', this.effectivePrefs.rendererType);
    this.terminal.setOption(
      'scrollSensitivity',
      this.effectivePrefs.scrollSensitivity
    );
    this.terminal.setOption('scrollback', this.effectivePrefs.scrollback);
    this.terminal.refresh(0, this.terminal.rows - 1);
    this.handleResize();
    // TODO: temporary
    for (let ix = 1; ix <= 100; ix++)
      this.terminal.writeln(
        `#${ix} oO08 iIlL1 g9qCGQ ~-+=> ${this.effectivePrefs.fontFamily} ${this.effectivePrefs.fontSize}pt`
      );
  }

  private handleActions$(): void {
    this.actions$
      .pipe(
        filter(({ action, status }) => {
          return (
            (action['PrefsState.update'] &&
              !action['PrefsState.update'].splitID) ||
            (action['PrefsState.update']?.splitID === this.splitID &&
              status === 'SUCCESSFUL')
          );
        }),
        debounceTime(0),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.adjustTerminal();
        this.cdf.markForCheck();
      });
  }

  private setupTerminal(): void {
    const dflts = TerminalPrefsState.defaultPrefs();
    this.terminal = new Terminal({
      allowTransparency: true,
      cursorBlink: dflts.cursorBlink,
      cursorStyle: dflts.cursorStyle,
      fontFamily: dflts.fontFamily,
      fontSize: dflts.fontSize,
      fontWeight: dflts.fontWeight,
      fontWeightBold: dflts.fontWeightBold,
      letterSpacing: dflts.letterSpacing,
      lineHeight: dflts.lineHeight,
      logLevel: 'info',
      rendererType: dflts.rendererType,
      scrollSensitivity: dflts.scrollSensitivity,
      scrollback: dflts.scrollback,
      theme: {
        background: 'transparent'
      }
    });
    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);
    this.terminal.loadAddon(new SearchAddon());
    this.terminal.loadAddon(new WebLinksAddon());
    this.terminal.open(this.renderer.nativeElement);
    this.terminal.focus();
    this.adjustTerminal();
  }
}
