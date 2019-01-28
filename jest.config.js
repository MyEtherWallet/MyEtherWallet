module.exports = {
  collectCoverage:process.env.NODE_ENV === 'production' ? true : false,
  globals: {
    WITH_NETWORK: false,
    VERSION: 'test'
  },
  collectCoverageFrom: ['src/**/*.{js,vue}'],
  coveragePathIgnorePatterns: ['.*index.js$', 'src/components/FaqContents/.*', 'src/wallets/hardware/.*', 'src/networks/.*'],
  coverageDirectory: '<rootDir>/tests/unit/coverage',
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue', 'node', 'svg'],
  reporters: ['default', 'jest-skipped-reporter'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@@/(.*)$': '<rootDir>/tests/unit/$1',
    '^@/tests$': '<rootDir>/tests/index.js',
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
    '\\.worker.js': '<rootDir>/tests/unit/__mocks__/workerMock.js'
  },
  transformIgnorePatterns: ['node_modules/(?!vue-router)'],
  moduleDirectories: ['node_modules'],
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  testEnvironmentOptions: {},
  testURL: 'http://localhost/'
};
