const css = 'css selector';
const privKey =
  '0x0077ce8e3d12432dc73e87943fe1e992db90964fbb6e8ae9f97a7163585c6019';
const nonce = 5;
const gasPrice = 15729840604;
const gasLimit = 38000;
const address = '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D';
const signedTx =
  '0xf85f80648252089400450992bc72ab99ae55bccdce68e160412fdac0808026a02ded23817f70cae1b6b6a024d68e165e4fff9dafe8945bc07ba61f9bd87a3557a005f2aa88e4286ae112d283086e6329083cef52b2d924b73a1b3f64dd0d1c85f6';
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
    browser.waitForElementVisible('#input-248');
    browser.getValue('#input-248', result => {
      this.assert.equal(result.value, signedTx);
    });
  }
};
