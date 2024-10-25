const { startBrowser } = require('../functions');

const css = 'css selector';
const privKey =
  '0x0077ce8e3d12432dc73e87943fe1e992db90964fbb6e8ae9f97a7163585c6019';
const contractName = 'cro';
const functionName = 'name';

module.exports = {
  before: function (browser) {
    browser.globals.waitForConditionTimeout = 15000;
  },
  'Contract Interactions test': async browser => {
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

    // click contract interaction
    browser
      .waitForElementVisible(css, 'div img[alt=Contract]')
      .click(css, 'div img[alt=Contract]')
      .waitForElementVisible(css, 'a[href="#/wallet/interact"]')
      .click(css, 'a[href="#/wallet/interact"]');

    // select ENS resolver contract
    browser.assert
      .urlContains('wallet/interact')
      .waitForElementVisible(css, '.ContractSelect')
      .click(css, '.ContractSelect')
      .waitForElementVisible(css, '.mew-select-search')
      .click(css, '.mew-select-search')
      .sendKeys(css, 'input:focus', contractName)
      .waitForElementVisible(css, '.v-select-list .v-list-item')
      .click(css, '.v-select-list .v-list-item');

    // click interact button
    browser.ensure
      .elementIsEnabled('.InteractButton')
      .click(css, '.InteractButton');

    // click name function
    browser
      .waitForElementVisible(css, '.FunctionSelect')
      .click(css, '.FunctionSelect')
      .sendKeys(css, 'input:focus', functionName)
      .sendKeys(css, 'input:focus', browser.Keys.ENTER);

    // click call button when enabled
    browser.ensure
      .elementIsEnabled('.CallFunctionButton')
      .click(css, '.CallFunctionButton');
  }
};
