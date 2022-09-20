// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide

const { startBrowser } = require('../functions');

module.exports = {
  'default e2e tests': browser => {
    startBrowser(browser);
  }
};
