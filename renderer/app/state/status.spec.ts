import { Bundle } from './state.spec';
import { Status } from './status';
import { StatusState } from './status';

import { prepare } from './state.spec';

import 'jest-extended';

const state: Record<string, Record<string, Status>> = {
  a: {
    a1: {
      cwd: '/home',
      search: null,
      searchCaseSensitive: false,
      searchRegex: false,
      searchWholeWord: false
    }
  }
};

describe('StatusState', () => {
  let bundle: Bundle;

  beforeEach(() => {
    bundle = prepare();
    bundle.status.setState(state);
  });

  test('remove', () => {
    bundle.status.remove({ splitID: 'a' });
    expect(bundle.status.snapshot).toEqual({});
  });

  test('update - create new split', () => {
    bundle.status.update({
      splitID: 'b',
      widgetID: 'b1',
      status: {
        cwd: '/root'
      }
    });
    expect(bundle.status.snapshot).toEqual({
      a: {
        a1: {
          cwd: '/home',
          search: null,
          searchCaseSensitive: false,
          searchRegex: false,
          searchWholeWord: false
        }
      },
      b: {
        b1: {
          cwd: '/root'
        }
      }
    });
  });

  test('update - create new widget', () => {
    bundle.status.update({
      splitID: 'a',
      widgetID: 'a2',
      status: {
        cwd: '/root'
      }
    });
    expect(bundle.status.snapshot).toEqual({
      a: {
        a1: {
          cwd: '/home',
          search: null,
          searchCaseSensitive: false,
          searchRegex: false,
          searchWholeWord: false
        },
        a2: {
          cwd: '/root'
        }
      }
    });
  });

  test('update - update existing status', () => {
    bundle.status.update({
      splitID: 'a',
      widgetID: 'a1',
      status: {
        cwd: '/root'
      }
    });
    expect(bundle.status.snapshot).toEqual({
      a: {
        a1: {
          cwd: '/root',
          search: null,
          searchCaseSensitive: false,
          searchRegex: false,
          searchWholeWord: false
        }
      }
    });
  });

  test('match', () => {
    bundle.status.update({
      splitID: 'a',
      widgetID: 'a1',
      status: {
        search: 'hello'
      }
    });
    expect(bundle.status.match('a', 'a1', ['hello', 'goodbye'])).toBeTrue();
    expect(bundle.status.match('a', 'a1', ['hola', 'sayonara'])).toBeFalse();
  });

  test('match - with no search or matchees', () => {
    bundle.status.update({
      splitID: 'a',
      widgetID: 'a1',
      status: {
        search: 'hello'
      }
    });
    expect(bundle.status.match('a', 'a1', [])).toBeTrue();
    bundle.status.update({
      splitID: 'a',
      widgetID: 'a1',
      status: {
        search: null
      }
    });
    expect(bundle.status.match('a', 'a1', ['hello'])).toBeTrue();
  });

  test('regex', () => {
    bundle.status.update({
      splitID: 'a',
      widgetID: 'a1',
      status: {
        search: '[($^)]',
        searchCaseSensitive: false,
        searchRegex: false,
        searchWholeWord: true
      }
    });
    expect(bundle.status.regex('a', 'a1')).toEqual(/(\b\[\(\$\^\)\]\b)/gi);
  });

  test('status', () => {
    expect(bundle.status.status('a', 'a1')).toEqual({
      cwd: '/home',
      search: null,
      searchCaseSensitive: false,
      searchRegex: false,
      searchWholeWord: false
    });
  });

  test('status', () => {
    expect(bundle.status.status('x', 'xxx')).toEqual(
      StatusState.defaultStatus()
    );
  });
});
