exports.startBrowser = browser =>
  browser
    .init()
    .url('https://localhost:8080')
    .waitForElementVisible('#app')
    .assert.title('MyEtherWallet | MEW')
    // close enkrypt popup
    .waitForElementVisible('css selector', '.the-enkrypt-popup')
    .click('css selector', '.the-enkrypt-popup > button')
    // click out overlay
    .waitForElementVisible('css selector', '.v-overlay')
    .click('css selector', '.v-overlay');
