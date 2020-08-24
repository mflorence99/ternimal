import { TabsState } from '../../state/tabs';
import { TerminalPrefs } from '../../state/terminal/prefs';
import { TerminalPrefsState } from '../../state/terminal/prefs';
import { Widget } from '../widget';
import { WidgetLaunch } from '../widget';
import { WidgetPrefs } from '../widget';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import { FitAddon } from 'xterm-addon-fit';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { SearchAddon } from 'xterm-addon-search';
import { Terminal } from 'xterm';
import { ViewChild } from '@angular/core';
import { WebLinksAddon } from 'xterm-addon-web-links';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  constructor(public prefs: TerminalPrefsState, public tabs: TabsState) {}

  handleResize(): void {
    // NOTE: this roundabout way seems to eliminate the flicker
    // that plain fit() generates
    const { cols, rows } = this.fitAddon.proposeDimensions();
    this.terminal.resize(cols, rows);
  }

  ngOnInit(): void {
    // TODO: temporary
    this.effectivePrefs = this.prefs.effectivePrefs(
      this.tabs.tab.layoutID,
      this.splitID
    );
    this.terminal = new Terminal({
      allowTransparency: true,
      fontFamily: this.effectivePrefs.fontFamily,
      fontSize: this.effectivePrefs.fontSize,
      lineHeight: 1,
      logLevel: 'info',
      rendererType: 'dom',
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

    for (let ix = 1; ix <= 100; ix++)
      this.terminal.writeln(
        `Hello from \x1B[1;3;31mxterm.js\x1B[0m 1 ${ix} \u25b6 `
      );
  }
}
