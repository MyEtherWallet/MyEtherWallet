// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide

module.exports = {
  before: function (browser) {
    browser.globals.waitForConditionTimeout = 15000;
  },
  'create wallet tests': browser => {
    browser
      .init()
      .url('https://localhost:8080')
      .waitForElementVisible('#app')
      .assert.title('MyEtherWallet | MEW')
      .waitForElementVisible('css selector', '.v-overlay')
      .click('css selector', '.v-overlay')
      .waitForElementVisible('css selector', '.homeLandingCreateWallet')
      .click('css selector', '.homeLandingCreateWallet')
      .assert.urlContains('/wallet/create')
      .waitForElementVisible('css selector', '#createWalletSoftware')
      .click('css selector', '#createWalletSoftware')
      .assert.urlContains('wallet/create/software?type=overview')
      .waitForElementVisible(
        'css selector',
        '#createWalletSoftwareOverviewKeystore'
      )
      .click('css selector', '#createWalletSoftwareOverviewKeystore')
      .elements('tag name', 'input', result => {
        console.log(result.value);
      })
      .end();
    // .waitForElementVisible('.createWalletKeystorePasswordInput')
    // .setValue(
    //   '.createWalletKeystorePasswordInput.v-input__control.v-input__slot.v-text-field__slot',
    //   'mewcreatewalletkeystore1234'
    // )
    // .waitForElementVisible('.createWalletKeystoreConfirmPWInput')
    // .setValue(
    //   '.createWalletKeystoreConfirmPWInput.v-input__control.v-input__slot.v-text-field__slot',
    //   'mewcreatewalletkeystore1234'
    // )
    // .expect.elemt('#createWalletKeystoreSubmitButton').to.have.attribute('class').which.contains('greenPrimary');
  }
};
