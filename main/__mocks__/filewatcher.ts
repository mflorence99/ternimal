import { on } from '../common';

function filewatcher(): any {
  return {
    add: jest.fn(),
    on: jest.fn(on),
    remove: jest.fn()
  };
}

module.exports = filewatcher;
