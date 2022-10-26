const { startBrowser } = require('../functions');

const css = 'css selector';
const address = 'bc1qludar9az7epe3rrazdh470e326eum9shchzcc8';
const privKey =
  '0x0077ce8e3d12432dc73e87943fe1e992db90964fbb6e8ae9f97a7163585c6019';
const amount = '0.1';
const coin = 'BTC';

module.exports = {
  before: function (browser) {
    browser.globals.waitForConditionTimeout = 15000;
  },
  'Swap Crosschain test': async browser => {
    // open browser
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
      .sendKeys(css, '.v-text-field__slot > input', privKey)
      .click(css, '.PrivateKeyTerms > div')
      .click(css, '.PrivateKeyAccess')
      .assert.urlContains('dashboard');

    // click swap button
    browser.waitForElementVisible(css, '.SwapButton').click(css, '.SwapButton');

    // select to token
    browser.assert
      .urlContains('swap')
      .waitForElementVisible(css, '.BalanceLabel')
      .click(css, '.ToTokenSelect')
      .waitForElementVisible(css, '.mew-select-search')
      .click(css, '.mew-select-search')
      .sendKeys(css, 'input:focus', coin)
      .click(css, 'img[alt=BTC]')
      .click(css, '.SwitchTokens');

    // input from amount
    browser.click(css, '.FromAmountInput').sendKeys(css, 'input:focus', amount);

    // input address
    browser
      .waitForElementVisible(css, '.AddressBookDiv')
      .click(css, '.FromAddressInput')
      .sendKeys(css, 'input:focus', address);

    // click swap when enabled
    browser
      .waitForElementVisible(css, '.NextButtonDiv')
      .ensure.elementIsEnabled('.NextButton')
      .click(css, '.NextButton');
  }
};
