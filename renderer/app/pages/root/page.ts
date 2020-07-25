import { LayoutState } from '../../state/layout';
import { TernimalState } from '../../state/ternimal';

import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-root',
  templateUrl: 'page.html',
  styleUrls: ['page.scss']
})

export class RootPageComponent {

  /** ctor */
  constructor(public layout: LayoutState,
              public ternimal: TernimalState) { }

}
