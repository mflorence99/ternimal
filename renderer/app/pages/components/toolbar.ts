import { Channels } from '../../common/channels';
import { LayoutState } from '../../state/layout';
import { SelectionState } from '../../state/selection';
import { Tab } from '../../state/tabs';
import { TabsState } from '../../state/tabs';
import { TernimalState } from '../../state/ternimal';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { ContextMenuService } from 'ngx-contextmenu';
import { ElectronService } from 'ngx-electron';
import { UUID } from 'angular2-uuid';
import { ViewChild } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-toolbar',
  templateUrl: 'toolbar.html',
  styleUrls: ['toolbar.scss']
})

export class ToolbarComponent {

  @ViewChild(ContextMenuComponent, { static: true }) contextMenu: ContextMenuComponent;

  constructor(private contextMenuService: ContextMenuService,
              public electron: ElectronService,
              public layout: LayoutState,
              public selection: SelectionState,
              public tabs: TabsState,
              public ternimal: TernimalState) { }

  devTools(): void {
    this.electron.ipcRenderer.send(Channels.openDevTools);
  }

  newLayout(): void {
    const layoutID = UUID.UUID();
    const tab: Tab = {
      color: 'var(--mat-grey-100)',
      icon: ['fas', 'laptop'],
      label: `New Tab ${this.ternimal.unique('tab')}`,
      layoutID: layoutID
    };
    this.layout.newLayout({ layoutID });
    this.tabs.newTab({ tab });
    this.selection.selectLayout({ layoutID });
    this.ternimal.showTabPrefs();
  }

  reload(): void {
    this.electron.ipcRenderer.send(Channels.reload);
  }

  showContextMenu(event: MouseEvent): void {
    // @see https://www.npmjs.com/package/ngx-contextmenu
    this.contextMenuService.show.next({ 
      contextMenu: this.contextMenu, 
      event: event, 
      item: null 
    });
    // NOTE: eat mouse click
    event.preventDefault();
    event.stopPropagation();
  }

}
