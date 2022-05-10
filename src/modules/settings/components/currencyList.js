class Currency {
  /**
   * @param {string} name - Curreny Name
   * @param {string} value - Defaults to Curreny Name
   * @param {string} img - Path to Icon
   */
  constructor({ name, value = name, img }) {
    this.name = name;
    this.value = value;
    //https://hatscripts.github.io/circle-flags/flags/xx.svg
    //`../../../../node_modules/circle-flags/flags/${img.toLowerCase()}.svg`
    this.img = img
      ? `https://hatscripts.github.io/circle-flags/flags/${img.toLowerCase()}.svg`
      : '';
  }
}
export default [
  new Currency({ name: 'USD', img: 'us' }),
  ...[
    new Currency({ name: 'RUB', img: 'ru' }),
    new Currency({ name: 'EUR', img: 'european_union' }),
    new Currency({ name: 'GBP', img: 'uk' })
  ].sort((a, b) => {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  })
];
