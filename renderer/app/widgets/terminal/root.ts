import { Channels } from '../../common';
import { DestroyService } from '../../services/destroy';
import { TabsState } from '../../state/tabs';
import { TerminalPrefs } from '../../state/terminal/prefs';
import { TerminalPrefsState } from '../../state/terminal/prefs';
import { TerminalXtermDataState } from '../../state/terminal/xterm-data';
import { Utils } from '../../services/utils';
import { Widget } from '../widget';
import { WidgetCommand } from '../widget';
import { WidgetLaunch } from '../widget';
import { WidgetPrefs } from '../widget';
import { WidgetStatus } from '../widget';

import { Actions } from '@ngxs/store';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { ElementRef } from '@angular/core';
import { FitAddon } from 'xterm-addon-fit';
import { Input } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { SearchAddon } from 'xterm-addon-search';
import { Terminal } from 'xterm';
import { ViewChild } from '@angular/core';
import { WebLinksAddon } from 'xterm-addon-web-links';

import { debounceTime } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
  templateUrl: 'root.html',
  selector: 'ternimal-terminal-root',
  styleUrls: ['root.scss']
})
export class TerminalComponent implements OnDestroy, OnInit, Widget {
  effectivePrefs: TerminalPrefs;
  @ViewChild('renderer', { static: true }) renderer: ElementRef;

  @Input() splitID: string;

  widgetLaunch: WidgetLaunch = {
    description: 'Terminal',
    icon: ['fas', 'laptop-code'],
    implementation: 'TerminalComponent'
  };

  widgetMenuItems: WidgetCommand[][] = [
    [
      {
        command: 'copyToClipboard()',
        description: 'Copy',
        if: 'canCopyToClipboard()'
      },
      {
        accelerator: {
          ctrlKey: true,
          description: 'Ctrl+Shift+V',
          key: 'V'
        },
        command: 'pasteFromClipboard()',
        description: 'Paste',
        if: 'canPasteFromClipboard()'
      }
    ]
  ];

  widgetPrefs: WidgetPrefs = {
    description: 'Terminal setup',
    implementation: 'TerminalPrefsComponent'
  };

  widgetStatus: WidgetStatus = {
    gotoCWD: 'chdir',
    showCWD: true
  };

  private fitAddon: FitAddon;
  private terminal: Terminal;

  constructor(
    private actions$: Actions,
    private cdf: ChangeDetectorRef,
    private destroy$: DestroyService,
    public electron: ElectronService,
    private host: ElementRef,
    public prefs: TerminalPrefsState,
    public tabs: TabsState,
    private utils: Utils,
    public xtermData: TerminalXtermDataState
  ) {}

  canCopyToClipboard(): boolean {
    return this.terminal.hasSelection();
  }

  canPasteFromClipboard(): boolean {
    return !!this.electron.ipcRenderer.sendSync(Channels.nativeClipboardRead);
  }

  chdir(path: string): void {
    this.electron.ipcRenderer.send(
      Channels.xtermToPty,
      this.splitID,
      `cd ${path}\n`
    );
  }

  copyToClipboard(): void {
    this.electron.ipcRenderer.send(
      Channels.nativeClipboardWrite,
      this.terminal.getSelection()
    );
    this.terminal.focus();
  }

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

  ngOnDestroy(): void {
    this.terminal?.dispose();
    this.electron.ipcRenderer.send(Channels.xtermDisconnect, this.splitID);
  }

  ngOnInit(): void {
    this.effectivePrefs = this.prefs.effectivePrefs(
      this.tabs.tab.layoutID,
      this.splitID
    );
    this.handleActions$();
    this.setupTerminal();
  }

  pasteFromClipboard(): void {
    const data = this.electron.ipcRenderer.sendSync(
      Channels.nativeClipboardRead
    );
    this.electron.ipcRenderer.send(Channels.xtermToPty, this.splitID, data);
    this.terminal.focus();
  }

  // private methods

  private adjustTerminal(): void {
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
        tap(({ action, status }) => {
          if (
            action['TerminalXtermDataState.produce']?.splitID ===
              this.splitID &&
            status === 'SUCCESSFUL'
          )
            this.terminal.write(this.xtermData.xtermData(this.splitID));
        }),
        filter(({ action, status }) => {
          return (
            ((action['PrefsState.update'] &&
              !action['PrefsState.update'].splitID) ||
              action['PrefsState.update']?.splitID === this.splitID) &&
            status === 'SUCCESSFUL'
          );
        }),
        debounceTime(0),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.effectivePrefs = this.prefs.effectivePrefs(
          this.tabs.tab.layoutID,
          this.splitID
        );
        this.adjustTerminal();
        this.cdf.markForCheck();
      });
  }

  private setupTerminal(): void {
    const dflts = TerminalPrefsState.defaultPrefs();
    this.terminal = new Terminal({
      allowProposedApi: true,
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
        background: 'transparent',
        foreground: this.utils.colorOf(this.host, '--text-color', 1)
      }
    });
    this.terminal.open(this.renderer.nativeElement);
    this.terminal.focus();
    // configure the UI with required add-ons
    this.fitAddon = new FitAddon();
    this.terminal['__fit'] = this.fitAddon;
    this.terminal.loadAddon(this.fitAddon);
    this.terminal.loadAddon(new SearchAddon());
    this.terminal.loadAddon(new WebLinksAddon());
    // connect xterm to node-pty
    this.electron.ipcRenderer.send(
      Channels.xtermConnect,
      this.splitID,
      this.effectivePrefs.root
    );
    this.terminal.onData((data: string) =>
      this.electron.ipcRenderer.send(Channels.xtermToPty, this.splitID, data)
    );
    this.adjustTerminal();
  }
}
