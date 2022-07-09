const { startBrowser } = require('../functions');

const css = 'css selector';
const signature =
  '0xf88380018203339407a565b7ed7d7a678680a4c162885bedbb695fe080a44401a6e4000000000000000000000000000000000000000000000000000000000000001226a0223a7c9bcf5531c99be5ea7082183816eb20cfe0bbc322e97cc5c7f71ab8b20ea02aadee6b34b45bb15bc42d9c09de4a6754e7000908da72d48cc7704971491663';
const address = '0x9ccCb2B82f8F607db3F5D50BF4083665c3002f83';
module.exports = {
  before: function (browser) {
    browser.globals.waitForConditionTimeout = 15000;
  },
  'MEW Wallet Link test': async browser => {
    // open browser
    startBrowser(browser);

    // remove footer
    browser.click(css, '.HideWalletBanner');

    // click on link
    browser
      .moveToElement('.FooterMEWTool', 10, 10)
      .click(css, '.FooterMEWTool');

    // switch to new tab
    const window = await browser.windowHandles();
    browser.closeWindow();
    browser.switchWindow(window.value[1]);

    // check url
    browser.assert.urlContains('mewwallet');
  },
  'MEW CX Link test': async browser => {
    // open browser
    startBrowser(browser);

    // click on link
    browser.moveToElement('.FooterCXTool', 10, 10).click(css, '.FooterCXTool');

    // switch to new tab
    const window = await browser.windowHandles();
    browser.closeWindow();
    browser.switchWindow(window.value[1]);

    // check url
    browser.assert.urlContains('mew-cx');
  },
  'Verify Message test': async browser => {
    // open browser
    startBrowser(browser);

    // click on link
    browser
      .moveToElement('.FooterVerifyTool', 10, 10)
      .click(css, '.FooterVerifyTool');

    // check if url is correct
    browser.assert.urlContains('verify');
  },
  'Convert Unit test': async browser => {
    // open browser
    startBrowser(browser);

     // click on link
    browser
      .moveToElement('.FooterConvertTool', 10, 10)
      .click(css, '.FooterConvertTool');

    // check if url is correct
    browser.assert.urlContains('convert');
  },
  'Generate Keystore test': async browser => {
    // open browser
    startBrowser(browser);

    // click on link
    browser
      .moveToElement('.FooterKeystoreTool', 10, 10)
      .click(css, '.FooterKeystoreTool');

    // check if url is correct
    browser.assert.urlContains('keystore');
  },
  'Send Offline Helper test': async browser => {
    // open browser
    startBrowser(browser);

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
      .moveToElement('.OfflineAddressInput', 10, 10)
      .click(css, '.OfflineAddressInput')
      .keys(address);

    // check download button and details
    browser
      .waitForElementVisible(css, '.DownloadButton')
      .waitForElementVisible(css, '.OfflineDetails')
      .click(css, '.NextButton2');

    // input valid signature
    browser
      .moveToElement('.SignatureInput', 10, 10)
      .click(css, '.SignatureInput')
      .keys(signature);

    // check if details are viewable
    browser.waitForElementVisible(css, '.SignatureRawDetails');
  }
};
