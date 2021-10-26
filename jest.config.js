module.exports = {
  collectCoverage: true, //process.env.NODE_ENV === 'production' ? true : false,
  globals: {
    WITH_NETWORK: false,
    VERSION: 'test',
    NODE_ENV: 'test',
    ROUTER_MODE: 'hash'
  },
  collectCoverageFrom: ['src/**/*.{js,vue}'],
  coveragePathIgnorePatterns: [
    '.*index.js$',
    'src/components/FaqContents/.*',
    'src/wallets/hardware/.*',
    'src/networks/.*'
  ],
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
    '^@/utils/networks$': '<rootDir>/tests/unit/__mocks__/networksMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@@/(.*)$': '<rootDir>/tests/unit/$1',
    '^@/tests$': '<rootDir>/tests/index.js',
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
    '\\.worker.js': '<rootDir>/tests/unit/__mocks__/workerMock.js',
    '\\.md': '<rootDir>/tests/unit/__mocks__/mdMockup.js'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(vue-router|bootstrap|register-service-worker|vue-tel-input))'
  ],
  moduleDirectories: ['node_modules'],
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)',
    '**/__tests__/*.(js | jsx | ts | tsx)',
    '**/tests/*.spec.js'
  ],
  testEnvironmentOptions: {},
  testURL: 'https://localhost:8080',
  setupFilesAfterEnv: ['<rootDir>/tests/unit/__mocks__/mocks.js']
};
