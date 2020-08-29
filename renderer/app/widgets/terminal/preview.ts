import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'ternimal-terminal-preview',
  templateUrl: 'preview.html',
  styleUrls: ['preview.scss']
})
export class TerminalPreviewComponent {
  snapshot: string;
}
