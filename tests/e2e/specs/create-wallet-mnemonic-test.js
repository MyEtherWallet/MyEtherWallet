// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide
const { chunk } = require('lodash');

const el = {
  'Create a New Wallet':
    '#app > div > div:nth-child(1) > main > div > div > div.mew-component--landing > div.desktop-content.d-none.d-lg-block.expandHeader > div > div > div.mt-9.d-flex > button.mr-3.v-btn.v-btn--has-bg.theme--light.v-size--default.greenPrimary.xlarge-btn.white--text.btn-background.mew-button',
  Software:
    '#app > div > div:nth-child(1) > main > div > div > div.container > div.mx-auto > div',
  'Mnemonic Phrase':
    '#app > div.v-dialog__content.v-dialog__content--active > div > div > div > div.row.ma-0.pa-0.d-flex.align-center.justify-center.flex-column > div > div.d-flex.flex-column.align-center.justify-center.px-8.pb-8 > div > div > div:nth-child(2)',
  'Hide Footer':
    '#app > div.v-application--wrap > div:nth-child(1) > div.white.d-flex.justify-center.align-center.text-center.full-width.footer-banner-container.footer-banner > div.cursor-pointer.font-weight-medium.close-container',
  'I Wrote Them Down':
    '#app > div.v-dialog__content.v-dialog__content--active > div > div > div > div.row.ma-0.pa-0.d-flex.align-center.justify-center.flex-column > div > div.d-flex.flex-column.align-center.justify-center.px-8.pb-8 > div > div > div:nth-child(2) > div.d-flex.justify-center.mt-6',
  Verify:
    '#app > div.v-dialog__content.v-dialog__content--active > div > div > div > div.row.ma-0.pa-0.d-flex.align-center.justify-center.flex-column > div > div.d-flex.flex-column.align-center.justify-center.px-8.pb-8 > div > div > div:nth-child(3) > div.d-flex.flex-column.flex-md-row.justify-center.mt-6 > button.mx-md-1.my-1.v-btn.v-btn--has-bg.theme--light.v-size--default.greenPrimary.xlarge-btn.white--text.btn-background.mew-button',
  Phrases:
    '#app > div.v-dialog__content.v-dialog__content--active > div > div > div > div.row.ma-0.pa-0.d-flex.align-center.justify-center.flex-column > div > div.d-flex.flex-column.align-center.justify-center.px-8.pb-8 > div > div > div:nth-child(2) > div.phrase-block.border-radius--5px.px-7.py-4.mb-8 > div',
  Checks:
    '#app > div.v-dialog__content.v-dialog__content--active > div > div > div > div.row.ma-0.pa-0.d-flex.align-center.justify-center.flex-column > div > div.d-flex.flex-column.align-center.justify-center.px-8.pb-8 > div > div > div:nth-child(3) > div.mx-auto.v-sheet.theme--light',
  'Access Wallet':
    '#app > div.v-dialog__content.v-dialog__content--active > div > div > div > div.row.ma-0.pa-0.d-flex.align-center.justify-center.flex-column > div > div.d-flex.flex-column.align-center.justify-center.px-8.pb-8 > div > div > div:nth-child(4) > div > div:nth-child(1) > div.d-flex.flex-column > button.mb-5.v-btn.v-btn--has-bg.theme--light.v-size--default.greenPrimary.xlarge-btn.white--text.btn-background.mew-button'
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
      .click(css, el['Hide Footer'])

      // create a new wallet
      .waitForElementVisible(css, el['Create a New Wallet'])
      .click(css, '#app')
      .click(css, el['Create a New Wallet'])
      .assert.urlContains('/wallet/create');

    // click software
    browser
      .waitForElementVisible(el['Software'], 500)
      .click(css, el['Software'])
      .assert.urlContains('/software');

    // select mnemonic phrase
    browser
      .waitForElementVisible(css, el['Mnemonic Phrase'])
      .click(css, el['Mnemonic Phrase']);

    // step 1
    browser.assert
      .urlContains('mnemonic')
      .waitForElementVisible(css, el['I Wrote Them Down'])
      .getText(css, el['Phrases'], result => {
        phrases = result.value.split('\n');
      })
      .click(css, el['I Wrote Them Down']);

    // step 2
    browser
      .waitForElementVisible(css, el['Verify'])
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
          .click(css, el['Verify']);
      });

    // step 3
    browser
      .waitForElementVisible(css, el['Access Wallet'])
      .click(css, el['Access Wallet'])
      .assert.urlContains('dashboard')
      .moveTo(null, 500, 0)
      .mouseButtonClick();
  }
};
