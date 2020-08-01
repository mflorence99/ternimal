import { Directive } from '@angular/core';
import { ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ternimalWidgetHost]'
})

export class WidgetHostDirective {
  constructor(public vcRef: ViewContainerRef) { }
}
