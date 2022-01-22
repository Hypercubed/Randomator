
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
  globals: {
    crypto: {
      getRandomValues: arr => crypto.randomBytes(arr.length)
    }
  },
};
