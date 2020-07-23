import { Channels } from '../../common/channels';
import { LayoutState } from '../../state/layout';
import { SelectionState } from '../../state/selection';
import { Tab } from '../../state/tabs';
import { TabsState } from '../../state/tabs';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { UUID } from 'angular2-uuid';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-toolbar',
  templateUrl: 'toolbar.html',
  styleUrls: ['toolbar.scss']
})

export class ToolbarComponent {

  /** ctor */
  constructor(public electron: ElectronService,
              public layout: LayoutState,
              public selection: SelectionState,
              public tabs: TabsState) { }

  /** Open dev tools */
  devTools(): void {
    this.electron.ipcRenderer.send(Channels.openDevTools);
  }

  /** Create a new layout */
  newLayout(): void {
    // TODO:
    const layoutID = UUID.UUID();
    const tab: Tab = {
      color: 'var(--google-blue-500)',
      icon: ['fab', 'docker'],
      label: `Layout ${Math.trunc(Math.random() * 100)}`,
      layoutID: layoutID
    };
    this.layout.newLayout({ layoutID });
    this.tabs.newTab({ tab });
    this.selection.selectLayout({ layoutID });
  }

  /** Reload app */
  reload(): void {
    this.electron.ipcRenderer.send(Channels.reload);
  }

}
