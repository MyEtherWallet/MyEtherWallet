const css = 'css selector';
const privKey =
  '0x0077ce8e3d12432dc73e87943fe1e992db90964fbb6e8ae9f97a7163585c6019';
const nonce = 5;
const gasPrice = 15729840604;
const gasLimit = 38000;
const address = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
const signedTx =
  '0xf86e058503a99251dc847d2c097094decaf9cd2367cdbb726e904cd6397edfcae6068d880de0b6b3a76400008025a0079785305b1fda847ea60c5c435b417e30214b580d4395c7c4326cf923e8a1fda044653cae077a15c206ec891167b4ccbea71a364fbe32b549045ebccfa6411713';
module.exports = {
  '@tags': 'offline',
  before: function (browser) {
    browser.globals.waitForConditionTimeout = 15000;
    browser.setNetworkConditions({
      offline: true
    });
  },
  'Access and Sign a sample transaction': async browser => {
    browser
      .init()
      .url('https://localhost:8080')
      .waitForElementVisible('#app')
      .assert.title('MyEtherWallet | MEW');

    browser
      .waitForElementVisible(css, '.AccessWalletSoftwareButton')
      .click(css, '.AccessWalletSoftwareButton');
    browser.assert.urlContains('/software');
    browser
      .waitForElementVisible(css, '.AccessPrivateKeyWallet')
      .click(css, '.AccessPrivateKeyWallet');

    // input private key
    browser.assert
      .urlContains('private-key')
      .waitForElementVisible(css, '.PrivateKeyInput')
      .click(css, '.PrivateKeyInput')
      .setValue('.PrivateKeyInput * input', privKey)
      .click(css, '.PrivateKeyTerms > div')
      .click(css, '.PrivateKeyAccess')
      .assert.urlContains('wallet');

    browser
      .setValue('.SendOfflineAmountInput * input', 1)
      .setValue('.SendOfflineNonceInput * input', nonce)
      .setValue('.SendOfflineGasPriceInput * input', gasPrice)
      .moveToElement('.SendOfflineUploadJsonButton', 10, 10)
      .setValue('.SendOfflineGasLimitInput * input', gasLimit)
      .setValue('.SendOfflineAddressBook * input', address)
      .setValue('.SendOFflineDataInput * input', '');

    browser.assert.not.hasAttribute(
      '.SendOfflineGenerateTransactionButton',
      'disabled'
    );
    browser.click(css, '.SendOfflineGenerateTransactionButton');
    browser.waitForElementVisible(css, '.SendOfflineSignedTxResultInput');
    browser.assert.valueEquals(
      '.SendOfflineSignedTxResultInput * textarea',
      signedTx
    );
  }
};
