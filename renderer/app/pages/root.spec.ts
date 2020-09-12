import { Channels } from '../../../common';
import { RootComponent } from './root';

import { on } from '../../../common';
import { prepare } from './page.spec';

import 'jest-extended';

import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  beforeEach(() => {
    prepare();
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
  });

  test('handleActions$ / rcvEror$', () => {
    component.ngOnInit();
    // NOTE: we cheated and made Actions a Subject rather than an Observable
    component.actions$['next']({
      action: {},
      status: 'SUCCESSFUL'
    });
    // pretend an error has been issued from the main thread
    on(Channels.error)(undefined, 'error');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(component.snackBar.open).toHaveBeenCalledWith('error', 'OK');
  });
});
