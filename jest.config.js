export default {
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.js', '**/test/**/*.spec.js', '**/test/api-test.js'],
  };
  