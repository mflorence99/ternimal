import * as fs from 'fs-extra';

// NNOTE: replacing trash with remove, but we are mocking the file sytem
// in our tests
module.exports = (path): void => {
  fs.removeSync(path);
};
