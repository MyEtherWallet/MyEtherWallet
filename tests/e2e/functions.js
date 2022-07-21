exports.startBrowser = browser =>
  browser
    .init()
    .url('https://localhost:8080')
    .waitForElementVisible('#app')
    .assert.title('MyEtherWallet | MEW')
    // click out overlay
    .waitForElementVisible('css selector', '.v-overlay')
    .click('css selector', '.v-overlay');
