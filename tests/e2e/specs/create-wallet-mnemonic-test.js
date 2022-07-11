// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide
const { chunk } = require('lodash');

const el = {
  Phrases:
    '#app > div.v-dialog__content.v-dialog__content--active > div > div > div > div.row.ma-0.pa-0.d-flex.align-center.justify-center.flex-column > div > div.d-flex.flex-column.align-center.justify-center.px-8.pb-8 > div > div > div:nth-child(2) > div.phrase-block.border-radius--5px.px-7.py-4.mb-8 > div',
  Checks:
    '#app > div.v-dialog__content.v-dialog__content--active > div > div > div > div.row.ma-0.pa-0.d-flex.align-center.justify-center.flex-column > div > div.d-flex.flex-column.align-center.justify-center.px-8.pb-8 > div > div > div:nth-child(3) > div.mx-auto.v-sheet.theme--light'
};

const firstPhrases = {
  1: '#app > div.v-dialog__content.v-dialog__content--active > div > div > div > div.row.ma-0.pa-0.d-flex.align-center.justify-center.flex-column > div > div.d-flex.flex-column.align-center.justify-center.px-8.pb-8 > div > div > div:nth-child(3) > div.mx-auto.v-sheet.theme--light > div:nth-child(1) > div > div > div > div > div:nth-child(1) > div > div',
  2: '#app > div.v-dialog__content.v-dialog__content--active > div > div > div > div.row.ma-0.pa-0.d-flex.align-center.justify-center.flex-column > div > div.d-flex.flex-column.align-center.justify-center.px-8.pb-8 > div > div > div:nth-child(3) > div.mx-auto.v-sheet.theme--light > div:nth-child(1) > div > div > div > div > div:nth-child(2) > div > div',
  3: '#app > div.v-dialog__content.v-dialog__content--active > div > div > div > div.row.ma-0.pa-0.d-flex.align-center.justify-center.flex-column > div > div.d-flex.flex-column.align-center.justify-center.px-8.pb-8 > div > div > div:nth-child(3) > div.mx-auto.v-sheet.theme--light > div:nth-child(1) > div > div > div > div > div:nth-child(3) > div > div'
};
const secondPhrases = {
  1: '#app > div.v-dialog__content.v-dialog__content--active > div > div > div > div.row.ma-0.pa-0.d-flex.align-center.justify-center.flex-column > div > div.d-flex.flex-column.align-center.justify-center.px-8.pb-8 > div > div > div:nth-child(3) > div.mx-auto.v-sheet.theme--light > div:nth-child(2) > div > div > div > div > div:nth-child(1) > div > div',
  2: '#app > div.v-dialog__content.v-dialog__content--active > div > div > div > div.row.ma-0.pa-0.d-flex.align-center.justify-center.flex-column > div > div.d-flex.flex-column.align-center.justify-center.px-8.pb-8 > div > div > div:nth-child(3) > div.mx-auto.v-sheet.theme--light > div:nth-child(2) > div > div > div > div > div:nth-child(2) > div > div',
  3: '#app > div.v-dialog__content.v-dialog__content--active > div > div > div > div.row.ma-0.pa-0.d-flex.align-center.justify-center.flex-column > div > div.d-flex.flex-column.align-center.justify-center.px-8.pb-8 > div > div > div:nth-child(3) > div.mx-auto.v-sheet.theme--light > div:nth-child(2) > div > div > div > div > div:nth-child(3) > div > div'
};
const thirdPhrases = {
  1: '#app > div.v-dialog__content.v-dialog__content--active > div > div > div > div.row.ma-0.pa-0.d-flex.align-center.justify-center.flex-column > div > div.d-flex.flex-column.align-center.justify-center.px-8.pb-8 > div > div > div:nth-child(3) > div.mx-auto.v-sheet.theme--light > div:nth-child(3) > div > div > div > div > div:nth-child(1) > div > div',
  2: '#app > div.v-dialog__content.v-dialog__content--active > div > div > div > div.row.ma-0.pa-0.d-flex.align-center.justify-center.flex-column > div > div.d-flex.flex-column.align-center.justify-center.px-8.pb-8 > div > div > div:nth-child(3) > div.mx-auto.v-sheet.theme--light > div:nth-child(3) > div > div > div > div > div:nth-child(2) > div > div',
  3: '#app > div.v-dialog__content.v-dialog__content--active > div > div > div > div.row.ma-0.pa-0.d-flex.align-center.justify-center.flex-column > div > div.d-flex.flex-column.align-center.justify-center.px-8.pb-8 > div > div > div:nth-child(3) > div.mx-auto.v-sheet.theme--light > div:nth-child(3) > div > div > div > div > div:nth-child(3) > div > div'
};

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

      // remove popups
      .click(css, '#app')
      .click(css, '#app')

      // remove footer
      .click(css, '.HideWalletBanner')

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
      .getText(css, el['Phrases'], result => {
        phrases = result.value.split('\n');
      })
      .click(css, '.MnemonicWroteThemDown');

    // step 2
    browser
      .waitForElementVisible(css, '.CreateMnemonicVerify')
      .getText(css, el['Checks'], result => {
        const checkPhrases = chunk(result.value.split('\n'), 4);
        const [first, second, third] = checkPhrases;

        const firstIndex = findIndex(first);
        const secondIndex = findIndex(second);
        const thirdIndex = findIndex(third);

        browser
          .click(css, firstPhrases[firstIndex])
          .click(css, secondPhrases[secondIndex])
          .click(css, thirdPhrases[thirdIndex])
          .pause(1000)
          .click(css, '.CreateMnemonicVerify');
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
