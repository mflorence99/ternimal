import { Layout } from '../../state/layout';
import { LayoutState } from '../../state/layout';
import { SelectionState } from '../../state/selection';
import { SortState } from '../../state/sort';
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

export class PaneComponent  {

  @ViewChild(ContextMenuComponent, { static: true }) contextMenu: ContextMenuComponent;

  @Input() index: number;
  @Input() split: Layout;
  @Input() splittable: Layout;

  constructor(public layout: LayoutState,
              public tabs: TabsState,
              public selection: SelectionState,
              public sort: SortState) { }

  closePane(): void {
    this.layout.closeSplit({ 
      splitID: this.splittable.id, 
      ix: this.index,
      // TODO
      visitor: split => this.sort.removeSort({ splitID: split.id })
    });
    // if the split we're removing is currently selected, try to select another
    if (this.isSelected()) 
      this.selection.selectSplit({ splitID: this.splittable.splits[0].id });
  }

  isCloseEnabled(): boolean {
    return this.splittable.splits?.length > 1;
  }

  isSelected(): boolean {
    return this.split.id === this.selection.splitID;
  }

  select(): void {
    if (!this.isSelected())
      this.selection.selectSplit({ splitID: this.split.id });
  }

  splitDown(): void {
    this.layout.makeSplit({ splitID: this.splittable.id, ix: this.index, direction: 'vertical', before: false });
  }

  splitLeft(): void {
    this.layout.makeSplit({ splitID: this.splittable.id, ix: this.index, direction: 'horizontal', before: true });
  }

  splitRight(): void {
    this.layout.makeSplit({ splitID: this.splittable.id, ix: this.index, direction: 'horizontal', before: false });
  }

  splitUp(): void {
    this.layout.makeSplit({ splitID: this.splittable.id, ix: this.index, direction: 'vertical', before: true });
  }

}
