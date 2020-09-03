module.exports = (): any => {
  return {
    add: jest.fn(),
    on: jest.fn(),
    remove: jest.fn()
  };
};
