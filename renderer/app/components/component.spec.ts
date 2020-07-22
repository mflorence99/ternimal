import { BarrelModule } from '../barrel';
import { ComponentsModule } from './module';
import { PipesModule } from '../pipes/module';

import { TestBed } from '@angular/core/testing';

export function prepare(): void {

  TestBed.configureTestingModule({
    imports: [
      BarrelModule,
      ComponentsModule,
      PipesModule
    ]
  }).compileComponents();

}

describe('Components tests helpers', () => {

  test('Dummy test', () => {
    expect(true).toBeTruthy();
  });

});
