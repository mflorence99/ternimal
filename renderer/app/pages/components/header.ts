import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-header',
  templateUrl: 'header.html',
  styleUrls: ['header.scss']
})

export class HeaderComponent {

}
