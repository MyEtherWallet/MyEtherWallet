// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide

const { startBrowser } = require('../functions');

module.exports = {
  before: function (browser) {
    browser.globals.waitForConditionTimeout = 15000;
  },
  'create wallet tests': browser => {
    // start browser
    startBrowser(browser)
      // actual test starts here
      // wait and find create wallet button
      .waitForElementVisible('css selector', '.HomeCreateWallet')
      .click('css selector', '.HomeCreateWallet')

      // successfully navigated to create wallet
      .assert.urlContains('/wallet/create')
      .waitForElementVisible('css selector', '.CreateWalletSoftware');
    browser.execute(function () {
      document.querySelector('.CreateWalletSoftware').click();
    });
    // select and fill in password
    browser.assert
      .urlContains('wallet/create/software?type=overview')
      .waitForElementVisible(
        'css selector',
        '.CreateWalletSoftwareOverviewKeystore'
      )
      .click('css selector', '.CreateWalletSoftwareOverviewKeystore')
      .waitForElementVisible('.CreateWalletKeystorePasswordInput')
      .setValue(
        '.CreateWalletKeystorePasswordInput * input',
        'mewcreatewalletkeystore1234'
      )
      .waitForElementVisible('.CreateWalletKeystoreConfirmPWInput')
      .setValue(
        '.CreateWalletKeystoreConfirmPWInput * input',
        'mewcreatewalletkeystore1234'
      )
      // expect button to be green
      .expect.element('.CreateWalletKeystoreSubmitButton')
      .to.have.attribute('class')
      .which.contains('greenPrimary');
    // click button
    browser
      .click('css selector', '.CreateWalletKeystoreSubmitButton')
      .waitForElementVisible('css selector', '.step-two-header')
      .waitForElementVisible('css selector', '.CreateWalletKeystoreAccept')
      .click('css selector', '.CreateWalletKeystoreAccept')
      .waitForElementVisible('css selector', '.step-three-header')
      .click('css selector', '.CreateWalletKeystoreAccess')
      .assert.urlContains('/wallet/access')
      .end();
  }
};
