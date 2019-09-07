module.exports = {
  collectCoverage: true, //process.env.NODE_ENV === 'production' ? true : false,
  globals: {
    WITH_NETWORK: false,
    VERSION: 'test',
    NODE_ENV: 'test',
    ROUTER_MODE: 'hash',
    BUILD_TYPE: 'web'
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
<<<<<<< HEAD
  reporters: ["default", 'jest-skipped-reporter'],
=======
  reporters: ['default', 'jest-skipped-reporter'],
>>>>>>> 2489abfb64db8439551553ffc8976a6edbae658a
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
<<<<<<< HEAD
=======
    '^@/networks$': '<rootDir>/tests/unit/__mocks__/networksMock.js',
>>>>>>> 2489abfb64db8439551553ffc8976a6edbae658a
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@@/(.*)$': '<rootDir>/tests/unit/$1',
    '^@/tests$': '<rootDir>/tests/index.js',
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
<<<<<<< HEAD
     "\\.worker.js":"<rootDir>/tests/unit/__mocks__/workerMock.js"
  },
  transformIgnorePatterns: [
      "node_modules/(?!vue-router)"
    ],
  moduleDirectories: [
      "node_modules"
    ],
=======
    '\\.worker.js': '<rootDir>/tests/unit/__mocks__/workerMock.js'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(vue-router|bootstrap|register-service-worker|vue-tel-input))'
  ],
  moduleDirectories: ['node_modules'],
>>>>>>> 2489abfb64db8439551553ffc8976a6edbae658a
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
<<<<<<< HEAD
  testEnvironmentOptions: {
    beforeParse(window) {
      window.scrollTo = ( x, y)=>{ window.pageXOffset = x; window.pageYOffset= y;};
    
      window.HTMLCanvasElement.prototype.getContext = () => {
          return  {
            fillStyle: function(){},
            fillRect: function(){},
            clearRect: function(){}
          }
      };
    
      window.HTMLCanvasElement.prototype.toDataURL = () => {
    
      };
    
    }
  },
  testURL: 'http://localhost/',

=======
  testEnvironmentOptions: {},
  testURL: 'http://localhost/',
  setupTestFrameworkScriptFile: '<rootDir>/tests/unit/__mocks__/mocks.js'
>>>>>>> 2489abfb64db8439551553ffc8976a6edbae658a
};
