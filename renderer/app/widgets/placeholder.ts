import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'ternimal-placeholder',
  template: '',
  styles: [':host { display: block; }']
})

export class PlaceholderComponent {

}
