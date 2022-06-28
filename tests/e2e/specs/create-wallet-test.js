// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide

module.exports = {
  before: function (browser) {
    browser.globals.waitForConditionTimeout = 15000;
  },
  'create wallet tests': browser => {
    // start browser
    browser
      .init()
      .url('https://localhost:8080')
      .waitForElementVisible('#app')
      .assert.title('MyEtherWallet | MEW')
      // click out overlay

      .waitForElementVisible('css selector', '.v-overlay')
      .click('css selector', '.v-overlay')
      // actual test starts here
      // wait and find create wallet button

      .waitForElementVisible('css selector', '.homeLandingCreateWallet')
      .click('css selector', '.homeLandingCreateWallet')
      // successfully navigated to create wallet
      .assert.urlContains('/wallet/create')
      .waitForElementVisible('css selector', '.createWalletSoftware');
    // .getLocationInView('css selector', '.createWalletSoftware')
    // .click('css selector', '.createWalletSoftware')
    browser.execute(function () {
      document.querySelector('.createWalletSoftware').click();
    });
    // select and fill in password
    browser.assert
      .urlContains('wallet/create/software?type=overview')
      .waitForElementVisible(
        'css selector',
        '.createWalletSoftwareOverviewKeystore'
      )
      .click('css selector', '.createWalletSoftwareOverviewKeystore')
      .waitForElementVisible('.createWalletKeystorePasswordInput')
      .setValue(
        '.createWalletKeystorePasswordInput * input',
        'mewcreatewalletkeystore1234'
      )
      .waitForElementVisible('.createWalletKeystoreConfirmPWInput')
      .setValue(
        '.createWalletKeystoreConfirmPWInput * input',
        'mewcreatewalletkeystore1234'
      )
      // expect button to be green
      .expect.element('.createWalletKeystoreSubmitButton')
      .to.have.attribute('class')
      .which.contains('greenPrimary');
    // click button
    browser
      .click('css selector', '.createWalletKeystoreSubmitButton')
      .waitForElementVisible('css selector', '.step-two-header')
      .waitForElementVisible(
        'css selector',
        '.createWalletKeystoreAcceptAndDownload'
      )
      .click('css selector', '.createWalletKeystoreAcceptAndDownload')
      .waitForElementVisible('css selector', '.step-three-header')
      .click('css selector', '.createWalletKeystoreGoToAccessButton')
      .assert.urlContains('/wallet/access')
      .end();
  }
};
