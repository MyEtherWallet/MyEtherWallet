const path = require('path');

const css = 'css selector';
const privKey =
  '0x0077ce8e3d12432dc73e87943fe1e992db90964fbb6e8ae9f97a7163585c6019';
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
      .assert.urlContains('wallet')
      .waitForElementVisible(css, '.SendOfflineUploadInput')
      .setValue(
        '.SendOfflineUploadInput * input',
        path.resolve(
          __dirname + '../test-files/generated-offline-tx-1662592753967.json'
        )
      );

    browser
      .getValue('.SendOfflineNonceInput * input', function (result) {
        console.log(result);
        this.assert.equal(result.value, 5);
      })
      .getValue('.SendOfflineGasPriceInput * input', function (result) {
        console.log(result);
        this.assert.equal(result.value, 15729840604);
      });
    browser
      .setValue('.SendOfflineGasLimitInput * input', 38000)
      .setValue(
        '.SendOfflineAmountInput * input',
        '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
      )
      .setValue(
        '.SendOFflineDataInput * input',
        '0x791ac947000000000000000000000000000000000000000000000000000807757ccc0a0000000000000000000000000000000000000000000000000000302c7ffd6c310c00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000080fac6042759cea6bdb7d8660161bb1c67b2c718000000000000000000000000000000000000000000000000000000006319310b0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000feeec9b428ce38ca95d1dba41b7b4005a6612bef000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
      );

    browser.assert.not
      .hasAttribute('.SendOfflineGenerateTransactionButton', 'disabled')
      .click(css, '.SendOfflineGenerateTransactionButton');
  }
};
