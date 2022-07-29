const { startBrowser } = require('../functions');

const css = 'css selector';
const privKey =
  '0x0077ce8e3d12432dc73e87943fe1e992db90964fbb6e8ae9f97a7163585c6019';
const address = '0x9ccCb2B82f8F607db3F5D50BF4083665c3002f83';
module.exports = {
  before: function (browser) {
    browser.globals.waitForConditionTimeout = 15000;
  },
  'Access Private Wallet test': async browser => {
    // open browser
    startBrowser(browser);
    browser
      .waitForElementVisible(css, '.HomeAccessWallet')
      .click(css, '.HomeAccessWallet');

    // remove footer
    browser.click(css, '.HideWalletBanner');

    // select software type wallet
    browser
      .moveToElement('.AccessSoftwareWallet', 10, 10)
      .waitForElementVisible('.AccessSoftwareWallet', 500)
      .click(css, '.AccessSoftwareWallet')
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
      .keys(privKey)
      .click(css, '.PrivateKeyTerms > div')
      .click(css, '.PrivateKeyAccess')
      .assert.urlContains('dashboard');

    // open balance card
    browser
      .moveTo(null, 500, 0)
      .mouseButtonClick()
      .waitForElementVisible(css, '.BalanceCardQR')
      .click(css, '.BalanceCardQR');

    // check if address is the expected address
    browser
      .waitForElementVisible(css, '.BalanceCardAddress')
      .expect.element('.BalanceCardAddress')
      .text.to.equal(address);
  }
};
