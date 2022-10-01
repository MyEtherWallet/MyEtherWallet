const css = 'css selector';
const address = '0x9ccCb2B82f8F607db3F5D50BF4083665c3002f83';
const amount = '0.0000001';

module.exports = {
  before: function (browser) {
    browser.globals.waitForConditionTimeout = 15000;
  },
  'Send Transaction test': async browser => {
    // Assuming on wallet dashboard
    browser
      .waitForElementVisible(css, '.SendTransaction')
      .click(css, '.SendTransaction');

    // input amount
    browser.assert
      .urlContains('send-tx')
      .waitForElementVisible(css, '.AmountInput')
      .click(css, '.AmountInput')
      .keys(amount);

    // input address
    browser
      .waitForElementVisible(css, '.AddressInput')
      .click(css, '.AddressInput')
      .keys(address);

    // click send when enabled
    browser.ensure.elementIsEnabled('.SendButton').click(css, '.SendButton');
  }
};
