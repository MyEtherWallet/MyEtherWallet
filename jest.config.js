module.exports = {
  collectCoverage: true,
  coveragePathIgnorePatterns: ["/node_modules/", "/index.js$"],
  collectCoverageFrom: ['src/**/*.{js,vue}'],
  coverageDirectory: '<rootDir>/tests/unit/coverage',
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue', 'node', 'svg'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css]styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$':
      'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@@/(.*)$': '<rootDir>/tests/unit/$1',
    "^@/test$": "<rootDir>/test/index.js",
    "^@/test/(.*)$": "<rootDir>/test/$1",
  },
  transformIgnorePatterns: [
      "node_modules/(?!vue-router)"
    ],
  moduleDirectories: [
      "node_modules"
    ],
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'
  ],
  testEnvironmentOptions: {
    // With the code below uncommented it was not permitting me to commit
    // beforeParse(window) {
    //   window.scrollTo = ( x, y)=>{ window.pageXOffset = x; window.pageYOffset= y;};
    // }
  },
  testURL: 'http://localhost/',

};
