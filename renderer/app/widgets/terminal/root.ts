import { Channels } from '../../common';
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
import { ElectronService } from 'ngx-electron';
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
  private static terminals: Record<string, Terminal> = {};

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
    public electron: ElectronService,
    public prefs: TerminalPrefsState,
    public tabs: TabsState
  ) {}

  handleResize(): void {
    // NOTE: this roundabout way seems to eliminate the flicker
    // that plain fit() generates
    const { cols, rows } = this.fitAddon.proposeDimensions();
    this.terminal.resize(cols, rows);
    this.electron.ipcRenderer.send(
      Channels.xtermResizePty,
      this.splitID,
      cols,
      rows
    );
  }

  ngOnInit(): void {
    this.handleActions$();
    this.handleData$();
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

  private handleData$(): void {
    this.electron.ipcRenderer.on(
      Channels.xtermFromPty + this.splitID,
      (_, data: string): void => this.terminal.write(data)
    );
  }

  private onData(_, data: string): void {
    this.terminal.write(data);
  }

  private setupTerminal(): void {
    this.terminal = TerminalComponent.terminals[this.splitID];
    if (!this.terminal) {
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
      TerminalComponent.terminals[this.splitID] = this.terminal;
      // configure the UI with required add-ons
      this.fitAddon = new FitAddon();
      this.terminal['__fit'] = this.fitAddon;
      this.terminal.loadAddon(this.fitAddon);
      this.terminal.loadAddon(new SearchAddon());
      this.terminal.loadAddon(new WebLinksAddon());
      // connect to node-pty
      this.terminal.onData((data: string) =>
        this.electron.ipcRenderer.send(Channels.xtermToPty, this.splitID, data)
      );
      this.electron.ipcRenderer.send(Channels.xtermConnect, this.splitID);
      this.terminal.open(this.renderer.nativeElement);
    } else {
      this.fitAddon = this.terminal['__fit'];
      const pp = this.renderer.nativeElement.parentNode;
      pp.insertBefore(this.terminal.element, this.renderer.nativeElement);
      this.renderer.nativeElement.remove();
    }
    this.terminal.focus();
    this.adjustTerminal();
  }
}
