import { Tab } from '../../state/tabs';
import { TabsComponent } from './tabs';

import { prepare } from './component.spec';

import { TestBed } from '@angular/core/testing';

import { async } from '@angular/core/testing';

describe('TabsComponent', () => {
  beforeEach(async(() => prepare()));

  test('Component is created', () => {
    const fixture = TestBed.createComponent(TabsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  test('isInMore', () => {
    const fixture = TestBed.createComponent(TabsComponent);
    const component = fixture.componentInstance;
    component.handleResize({ contentRect: { width: 150 } } as any);
    component.measureMore({ contentRect: { width: 20 } } as any);
    component.measureTab({ contentRect: { width: 30 } } as any);
    component.tabs.newTab({ tab: { layoutID: 'p' } });
    component.tabs.newTab({ tab: { layoutID: 'q' } });
    component.tabs.newTab({ tab: { layoutID: 'r' } });
    expect(component.tabs.snapshot.length).toBe(4);
    expect(component.isInMore('p')).toBe(false);
    expect(component.isInMore('q')).toBe(false);
    expect(component.isInMore('r')).toBe(true);
  });

  test('remove', () => {
    const fixture = TestBed.createComponent(TabsComponent);
    const component = fixture.componentInstance;
    const tab: Tab = {
      color: 'c',
      icon: ['i', 'j'],
      label: 'l',
      layoutID: 'a'
    };
    component.tabs.newTab({ tab });
    expect(component.tabs.snapshot.length).toBe(2);
    component.remove(tab);
    expect(component.tabs.snapshot.length).toBe(1);
  });

  test('select', () => {
    const fixture = TestBed.createComponent(TabsComponent);
    const component = fixture.componentInstance;
    const tab: Tab = {
      color: 'c',
      icon: ['i', 'j'],
      label: 'l',
      layoutID: 'a'
    };
    component.select(tab);
    expect(component.selection.layoutID).toBe('a');
  });
});
