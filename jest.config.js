module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    './main/**/*.ts',
    './renderer/app/**/*.ts',
    '!./renderer/app/**/barrel.ts',
    '!./renderer/app/**/icons.ts',
    '!./renderer/app/**/module.ts'
  ],
  coverageReporters: ['json-summary', 'text', 'html'],
  preset: 'jest-preset-angular',
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: './reports/junit' }]
  ],
  roots: [
    './main/',
    './renderer/app/components',
    './renderer/app/directives',
    './renderer/app/pages/directives',
    './renderer/app/pipes',
    './renderer/app/services',
    './renderer/app/state'
  ],
  setupFilesAfterEnv: [
    'jest-canvas-mock',
    'jest-extended',
    'jest-preset-angular',
    './__mocks__/jsdom.ts'
  ],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  testResultsProcessor: 'jest-junit',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  transformIgnorePatterns: ['^.+\\.js$']
};
