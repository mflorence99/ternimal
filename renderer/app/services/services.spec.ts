import { MockElectronService } from '../../__mocks__/ngx-electron';

import { ElectronService } from 'ngx-electron';
import { TestBed } from '@angular/core/testing';

export function prepare(): void {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: ElectronService,
        useClass: MockElectronService
      }
    ]
  });
}

describe('Services tests helpers', () => {
  test('Dummy test', () => {
    expect(true).toBeTruthy();
  });
});
