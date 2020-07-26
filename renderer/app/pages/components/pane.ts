import { Layout } from '../../state/layout';
import { LayoutState } from '../../state/layout';
import { SelectionState } from '../../state/selection';
import { TabsState } from '../../state/tabs';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { Input } from '@angular/core';
import { ViewChild } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-pane',
  templateUrl: 'pane.html',
  styleUrls: ['pane.scss']
})

export class PaneComponent {

  @ViewChild(ContextMenuComponent, { static: true }) contextMenu: ContextMenuComponent;

  @Input() index: number;
  @Input() split: Layout;
  @Input() splittable: Layout;

  constructor(public layout: LayoutState,
              public tabs: TabsState,
              public selection: SelectionState) { }

  // TODO:
  execute(command): void {
    switch (command) {
      case 'close':
        break;
      case 'horizontal-':
        this.layout.makeSplit({ splitID: this.splittable.id, ix: this.index, direction: 'horizontal', before: true });
        break;
      case 'horizontal+':
        this.layout.makeSplit({ splitID: this.splittable.id, ix: this.index, direction: 'horizontal', before: false });
        break;
      case 'vertical-':
        this.layout.makeSplit({ splitID: this.splittable.id, ix: this.index, direction: 'vertical', before: true });
        break;
      case 'vertical+':
        this.layout.makeSplit({ splitID: this.splittable.id, ix: this.index, direction: 'vertical', before: false });
        break;
    }
  }

  isCloseEnabled(): boolean {
    return this.splittable.splits?.length > 1;
  }

  select(): void {
    this.selection.selectSplit({ splitID: this.split.id });
  }

}
