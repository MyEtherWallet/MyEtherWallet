// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide
const { chunk } = require('lodash');

const css = 'css selector';
let phrases = [];

const findIndex = array => {
  for (let index = 1; index < array.length; index++) {
    const number = array[0];
    const phrase = array[index];

    const found = phrases
      .find(e => e.includes(number))
      .split('.')[1]
      .trim();

    if (found === phrase) return index;
  }
};

module.exports = {
  before: function (browser) {
    browser.globals.waitForConditionTimeout = 15000;
  },
  'create wallet mnemonic': async browser => {
    // start browser
    browser.windowMaximize();
    browser
      .url('https://localhost:8080')
      .waitForElementVisible('#app')
      // close enkrypt popup
      .waitForElementVisible('css selector', '.the-enkrypt-popup')
      .click('css selector', '.the-enkrypt-popup > button')
      // click out overlay
      .waitForElementVisible('css selector', '.v-overlay')
      .click('css selector', '.v-overlay')
      // create a new wallet
      .waitForElementVisible(css, '.HomeCreateWallet')
      .click(css, '#app')
      .click(css, '.HomeCreateWallet')
      .assert.urlContains('/wallet/create');

    // click software
    browser
      .waitForElementVisible('.CreateSoftwareWallet', 500)
      .click(css, '.CreateSoftwareWallet')
      .assert.urlContains('/software');

    // select mnemonic phrase
    browser
      .waitForElementVisible(css, '.CreateWalletSoftwareOverviewMnemonic')
      .click(css, '.CreateWalletSoftwareOverviewMnemonic');

    // step 1
    browser.assert
      .urlContains('mnemonic')
      .waitForElementVisible(css, '.MnemonicWroteThemDown')
      .getText(css, '.CreateWalletMnemonicTable', result => {
        phrases = result.value.split('\n');
      })
      .click(css, '.MnemonicWroteThemDown');

    // step 2
    browser
      .waitForElementVisible(css, '.CreateMnemonicVerify')
      .getText(css, '.MnemonicRadioOptions', result => {
        const checkPhrases = chunk(result.value.split('\n'), 4);
        const [first, second, third] = checkPhrases;

        const firstIndex = findIndex(first) - 1;
        const secondIndex = findIndex(second) - 1;
        const thirdIndex = findIndex(third) - 1;

        browser.elements(css, '.Options', r => {
          const options = chunk(r.value, 3);
          const [firstWord, secondWord, thirdWord] = options;

          browser
            .elementIdClick(Object.keys(firstWord[firstIndex])[0])
            .elementIdClick(Object.keys(secondWord[secondIndex])[0])
            .elementIdClick(Object.keys(thirdWord[thirdIndex])[0]);
        });

        browser.pause(1000).click(css, '.CreateMnemonicVerify');
      });

    // step 3
    browser
      .waitForElementVisible(css, '.CreateMnemonicAccessWallet')
      .click(css, '.CreateMnemonicAccessWallet')
      .assert.urlContains('dashboard')
      .moveTo(null, 500, 0)
      .mouseButtonClick();
  }
};
