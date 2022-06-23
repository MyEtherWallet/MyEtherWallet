// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide

module.exports = {
  'default e2e tests': browser => {
    browser
      .init()
      .url('https://localhost:8080')
      .waitForElementVisible('#app', 15000)
      .end();
  }
};
