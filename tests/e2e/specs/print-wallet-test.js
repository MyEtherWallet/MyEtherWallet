const { startBrowser } = require('../functions');
const css = 'css selector';

module.exports = {
  before: function (browser) {
    browser.globals.waitForConditionTimeout = 15000;
  },
  'print wallet tests': browser => {
    // start browser
    startBrowser(browser);
    browser
      .waitForElementVisible(css, '.HomeAccessWallet')
      .click(css, '.HomeAccessWallet');
    // select view paper wallet
    browser
      .waitForElementVisible(css, '.BalanceAddressPaperWallet')
      .click(css, '.BalanceAddressPaperWallet');
    // execute print function
    browser.execute(function () {
      document.querySelector('.print').click();
    });
  }
};
