// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide

module.exports = {
  before: function (browser) {
    browser.globals.waitForConditionTimeout = 15000;
  },
  'create wallet mnemonic': browser => {
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
        '.createWalletSoftwareOverviewMnemonic'
      )
      .click('css selector', '.createWalletSoftwareOverviewMnemonic')
      .waitForElementVisible('.createWalletMnemonicTable')
      .setValue(
        '.mnemonic-phrase-table * span',
        'solve furnace inmate betray script phone paper keep fame guilt tell dutch'
      );
    // expect button to be green
    // .expect.element('.createWalletKeystoreSubmitButton')
    // .to.have.attribute('class')
    // .which.contains('greenPrimary');
    // click button
  }
};
