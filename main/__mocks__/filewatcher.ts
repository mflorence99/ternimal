const callbacks = {};

function filewatcher(): any {
  return {
    add: jest.fn(),
    on: jest.fn((event, cb) => (callbacks[event] = cb)),
    remove: jest.fn()
  };
}

// private API for testing
filewatcher.callbacks = callbacks;

module.exports = filewatcher;
