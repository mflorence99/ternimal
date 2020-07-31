import { LayoutState } from '../state/layout';
import { TernimalState } from '../state/ternimal';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-root',
  templateUrl: 'root.html',
  styleUrls: ['root.scss']
})

export class RootComponent {

  constructor(public layout: LayoutState,
              public ternimal: TernimalState) { }

}
