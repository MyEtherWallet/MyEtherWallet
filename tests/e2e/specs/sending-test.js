const { startBrowser } = require('../functions');

const css = 'css selector';
const address = '0x9ccCb2B82f8F607db3F5D50BF4083665c3002f83';
const privKey =
  '0x0077ce8e3d12432dc73e87943fe1e992db90964fbb6e8ae9f97a7163585c6019';
const amount = '0.00000001';

module.exports = {
  before: function (browser) {
    browser.globals.waitForConditionTimeout = 15000;
  },
  'Send Transaction test': async browser => {
    // open browser
    startBrowser(browser);

    // click access wallet
    browser
      .waitForElementVisible(css, '.HomeAccessWallet')
      .click(css, '.HomeAccessWallet');

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

    // click send transaction
    browser
      .waitForElementVisible(css, '.SendTransaction')
      .click(css, '.SendTransaction');

    // input amount
    browser.assert
      .urlContains('send-tx')
      .waitForElementVisible(css, '.AmountInput')
      .click(css, '.AmountInput')
      .keys(amount);

    // input address
    browser.click(css, '.AddressInput').keys(address);

    browser.ensure.elementIsDisabled('.SendButton').execute(function () {
      document.querySelector('.SendButton').removeAttribute('disabled');
      document.querySelector('.SendButton').className =
        'SendButton v-btn v-btn--has-bg theme--light v-size--default greenPrimary xlarge-btn white--text btn-background mew-button';
    });

    // click send when enabled
    browser.ensure.elementIsEnabled('.SendButton').click(css, '.SendButton');
  }
};
