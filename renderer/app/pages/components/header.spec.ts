import { HeaderComponent } from './header';

import { prepare } from '../page.spec';

import 'jest-extended';

import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

describe('RootComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    prepare();
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  test('isMoreSelected', () => {
    component.selection.selectLayout({ layoutID: 'l' });
    component.tabs.inMore = [{ layoutID: 'l' }, { layoutID: 'm' }];
    expect(component.isMoreSelected()).toBeTrue();
    component.tabs.inMore = [{ layoutID: 'm' }];
    expect(component.isMoreSelected()).toBeFalse();
  });

  test('isTabsSelected', () => {
    component.selection.selectLayout({ layoutID: 'l' });
    expect(component.isTabsSelected({ layoutID: 'l' })).toBeTrue();
    expect(component.isTabsSelected({ layoutID: 'm' })).toBeFalse();
  });

  test('snapshot', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });
});
