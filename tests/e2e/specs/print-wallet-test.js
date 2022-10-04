const { startBrowser } = require('../functions');
const css = 'css selector';
const privKey =
  '0x0077ce8e3d12432dc73e87943fe1e992db90964fbb6e8ae9f97a7163585c6019';

module.exports = {
  before: function (browser) {
    browser.globals.waitForConditionTimeout = 15000;
  },
  'Print Wallet Test': async browser => {
    // start browser
    startBrowser(browser);
    browser.maximizeWindow();

    // click access wallet
    browser
      .waitForElementVisible(css, '.HomeAccessWallet')
      .click(css, '.HomeAccessWallet');

    // select software type wallet
    browser
      .moveToElement('.AccessWalletSoftwareButton', 10, 10)
      .waitForElementVisible('.AccessWalletSoftwareButton', 500)
      .click(css, '.AccessWalletSoftwareButton')
      .assert.urlContains('/software');

    // select private key
    browser
      .waitForElementVisible(css, '.AccessPrivateKeyWallet')
      .click(css, '.AccessPrivateKeyWallet');

    // input private key
    browser.assert
      .urlContains('private-key')
      .waitForElementVisible(css, '.PrivateKeyInput')
      .click(css, '.PrivateKeyInput')
      .sendKeys(css, 'input:focus', privKey)
      .click(css, '.PrivateKeyTerms > div')
      .click(css, '.PrivateKeyAccess')
      .assert.urlContains('dashboard');

    // select view paper wallet
    browser
      .waitForElementVisible(css, '.theBalanceCard')
      .click(css, '.balanceMenu');

    // open paper wallet
    browser.execute(function () {
      document
        .querySelector('.openThePaperWallet')
        .click(css, '.openThePaperWallet');
    });

    // execute print function
    browser.execute(function () {
      document.querySelector('.printButton').click(css, '.printButton');
    });
  }
};
