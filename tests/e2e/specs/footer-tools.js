const { startBrowser } = require('../functions');

const css = 'css selector';
const signature =
  '0xf88380018203339407a565b7ed7d7a678680a4c162885bedbb695fe080a44401a6e4000000000000000000000000000000000000000000000000000000000000001226a0223a7c9bcf5531c99be5ea7082183816eb20cfe0bbc322e97cc5c7f71ab8b20ea02aadee6b34b45bb15bc42d9c09de4a6754e7000908da72d48cc7704971491663';
const address = '0x9ccCb2B82f8F607db3F5D50BF4083665c3002f83';
const verifySignature = `{
  "address": "0xd0d919cb7e8285fe76e278a7e4c4b687a274176c",
  "msg": "0x74657374696e67",
  "sig": "ac0bf2cf6e4a9c91c91476dfc80319ae5f3e2bf6bf2f59e6e87f8d0e2fcffe2145d53173e81d7893b8e75813712ed9fbdd58e424ed5ffa19c2701f073c98cccc1b",
  "version": "3",
  "signer": "MEW"
}`;
const testPW = '1234password';
module.exports = {
  before: function (browser) {
    browser.globals.waitForConditionTimeout = 15000;
    browser.captureBrowserConsoleLogs(event => {
      console.log(
        event.type,
        event.timestamp,
        event.args[0].value,
        event.args[1]?.value ? event.args[1].value : event.args[1]
      );
    });
  },
  'MEW Wallet Link test': async browser => {
    // open browser
    startBrowser(browser);
    browser.maximizeWindow();

    // click on link
    browser
      .moveToElement('.FooterMEWTool', 10, 10)
      .click(css, '.FooterMEWTool');

    // switch to new tab
    const window = await browser.windowHandles();
    browser.closeWindow();
    browser.switchWindow(window[1]);

    // check url
    browser.assert.urlContains('mewwallet');
  },
  'Enkrypt Link test': async browser => {
    // open browser
    browser
      .url('https://localhost:8080')
      .waitForElementVisible('#app')
      .assert.title('MyEtherWallet | MEW')
      // click out overlay
      .waitForElementVisible('css selector', '.v-overlay')
      .click('css selector', '.v-overlay');
    browser.maximizeWindow();

    // click on link
    browser.moveToElement('.FooterCXTool', 10, 10).click(css, '.FooterCXTool');

    // switch to new tab
    const window = await browser.windowHandles();
    browser.closeWindow();
    browser.switchWindow(window[1]);

    // check url
    browser.assert.urlContains('enkrypt');
  },
  'Verify Message test': async browser => {
    // open browser
    browser
      .url('https://localhost:8080')
      .waitForElementVisible('#app')
      .assert.title('MyEtherWallet | MEW')
      // click out overlay
      .waitForElementVisible('css selector', '.v-overlay')
      .click('css selector', '.v-overlay');
    browser.maximizeWindow();

    // click on link
    browser
      .moveToElement('.FooterVerifyTool', 10, 10)
      .click(css, '.FooterVerifyTool');

    // check if url is correct
    browser.assert
      .urlContains('verify')
      .waitForElementVisible(css, '.VerifyInput')
      .click(css, '.VerifyInput')
      .sendKeys(css, 'textarea:focus', verifySignature);

    // input message
    browser
      .click(css, '.VerifyInput')
      .sendKeys(css, 'textarea:focus', verifySignature);

    // click button
    browser.ensure
      .elementIsEnabled('.VerifyButton')
      .click(css, '.VerifyButton');

    // check if message is viewable
    // browser.waitForElementVisible(css, '.VerifyMessage');
  },
  'Convert Unit test': async browser => {
    // open browser
    browser
      .url('https://localhost:8080')
      .waitForElementVisible('#app')
      .assert.title('MyEtherWallet | MEW')
      // click out overlay
      .waitForElementVisible('css selector', '.v-overlay')
      .click('css selector', '.v-overlay');
    browser.maximizeWindow();

    // click on link
    browser
      .moveToElement('.FooterConvertTool', 10, 10)
      .click(css, '.FooterConvertTool');

    // check if url is correct
    browser.assert.urlContains('convert');

    // check wei, gwei, ether
    browser
      .click('.CurrencyLeftInput input')
      .sendKeys(css, 'input:focus', '1000000000000000000');

    browser
      .click('.CurrencyRightSelect')
      .click('.menuable__content__active div :first-child')
      .click('.CurrencyLeftInput input')
      .sendKeys(css, 'input:focus', '1');

    browser
      .click('.CurrencyRightSelect')
      .click('.menuable__content__active div :nth-child(4)')
      .click('.CurrencyLeftInput input')
      .sendKeys(css, 'input:focus', '1000000000');
  },
  'Generate Keystore test': async browser => {
    // open browser
    browser
      .url('https://localhost:8080')
      .waitForElementVisible('#app')
      .assert.title('MyEtherWallet | MEW')
      // click out overlay
      .waitForElementVisible('css selector', '.v-overlay')
      .click('css selector', '.v-overlay');
    browser.maximizeWindow();

    // click on link
    browser
      .moveToElement('.FooterKeystoreTool', 10, 10)
      .click(css, '.FooterKeystoreTool');

    // check if url is correct
    browser.assert.urlContains('keystore');

    // select download
    browser
      .moveToElement('.KeystoreDownloadButton', 10, 10)
      .click(css, '.KeystoreDownloadButton');

    // enter test password
    browser
      .waitForElementVisible(css, '.KeystorePassword')
      .click(css, '.KeystorePassword')
      .sendKeys(css, 'input:focus', testPW);

    // enter test confirm password
    browser
      .waitForElementVisible(css, '.KeystoreConfirmPassword')
      .click(css, '.KeystoreConfirmPassword')
      .sendKeys(css, 'input:focus', testPW);

    // if download is visible
    browser.waitForElementVisible('.KeyStoreDiv');

    // accept terms
    browser.click(css, '.KeystoreConfirm');

    // check if download is enabled
    browser.ensure
      .elementIsEnabled('.KeystoreDownloadFile')
      .click(css, '.KeystoreDownloadFile');
  },
  'Send Offline Helper test': async browser => {
    // open browser
    browser
      .url('https://localhost:8080')
      .waitForElementVisible('#app')
      .assert.title('MyEtherWallet | MEW')
      // click out overlay
      .waitForElementVisible('css selector', '.v-overlay')
      .click('css selector', '.v-overlay');
    browser.maximizeWindow();

    // click on link
    browser
      .moveToElement('.FooterOfflineTool', 10, 10)
      .click(css, '.FooterOfflineTool');

    // check if url is correct
    browser.assert.urlContains('offline');

    // test offline tool using ETH
    browser.moveToElement('.NextButton', 10, 10).click(css, '.NextButton');

    // input address
    browser
      .waitForElementVisible('.OfflineAddressInput', 10, 10)
      .click(css, '.OfflineAddressInput')
      .sendKeys(css, 'input:focus', address);

    browser.waitForElementVisible(css, '.DownloadButtonDiv');

    // check download button and details
    browser
      .waitForElementVisible(css, '.NextButton2')
      .click(css, '.NextButton2');

    // input valid signature
    browser
      .waitForElementVisible('.SignatureInput', 10, 10)
      .click(css, '.SignatureInput')
      .sendKeys(css, 'textarea:focus', signature);

    // check if details are viewable
    browser.waitForElementVisible(css, '.SignatureRawDetails');
  }
};
