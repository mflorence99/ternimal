type WaitableMock = jest.Mock & {
  waitUntilComplete(): Promise<void>;
};

// @see https://github.com/facebook/jest/issues/7432
export const waitableJestFn = (times = 1): WaitableMock => {
  let resolver: Function;
  const promise = new Promise<void>((resolve) => (resolver = resolve));
  let i = 0;
  const mock = jest.fn(() => {
    if (++i >= times) resolver();
  }) as WaitableMock;
  mock.waitUntilComplete = (): Promise<void> => promise;
  return mock;
};

describe('Electron tests helpers', () => {
  test('Dummy test', () => {
    expect(true).toBeTruthy();
  });
});
