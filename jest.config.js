// const crypto = require('@trust/webcrypto');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: [
    "src/lib/**/*.ts",
    "!src/lib/**/index.ts", 
    "!src/lib/setupJest.ts",
  ],
  setupFilesAfterEnv: ['./jest.setup.js']
};
