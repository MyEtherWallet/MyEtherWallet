import flags from './flags';

import btcIcon from '@/assets/images/currencies/btc.png';
class Currency {
  /**
   * @param {Object} currency
   * @param {string} currency.name - Curreny Name
   * @param {string} currency.value - Defaults to Curreny Name
   * @param {string} currency.img - Path to Icon
   */
  constructor({ name, value = name, img }) {
    this.name = name;
    this.value = value;
    this.img = img ? img : flags.usFlag;
  }
}
const allCurrencies = [
  /**
   * Unsorted currencies go here
   */
  new Currency({ name: 'USD', img: flags.usFlag }),
  ...[
    new Currency({ name: 'AED', img: flags.aeFlag }),
    new Currency({ name: 'AFN', img: flags.afFlag }),
    new Currency({ name: 'ALL', img: flags.alFlag }),
    new Currency({ name: 'AMD', img: flags.amFlag }),
    new Currency({ name: 'ANG', img: flags.sxFlag }),
    new Currency({ name: 'AOA', img: flags.aoFlag }),
    new Currency({ name: 'ARS', img: flags.arFlag }),
    new Currency({ name: 'AUD', img: flags.auFlag }),
    new Currency({ name: 'AWG', img: flags.awFlag }),
    new Currency({ name: 'AZN', img: flags.azFlag }),
    new Currency({ name: 'BAM', img: flags.baFlag }),
    new Currency({ name: 'BBD', img: flags.bbFlag }),
    new Currency({ name: 'BDT', img: flags.bdFlag }),
    new Currency({ name: 'BGN', img: flags.bgFlag }),
    new Currency({ name: 'BHD', img: flags.bhFlag }),
    new Currency({ name: 'BIF', img: flags.biFlag }),
    new Currency({ name: 'BMD', img: flags.bmFlag }),
    new Currency({ name: 'BND', img: flags.bnFlag }),
    new Currency({ name: 'BOB', img: flags.boFlag }),
    new Currency({ name: 'BRL', img: flags.brFlag }),
    new Currency({ name: 'BSD', img: flags.bsFlag }),
    new Currency({ name: 'BTC', img: btcIcon }),
    new Currency({ name: 'BTN', img: flags.btFlag }),
    new Currency({ name: 'BWP', img: flags.bwFlag }),
    new Currency({ name: 'BYN', img: flags.byFlag }),
    new Currency({ name: 'BYR', img: flags.byFlag }),
    new Currency({ name: 'BZD', img: flags.bzFlag }),
    new Currency({ name: 'CAD', img: flags.caFlag }),
    new Currency({ name: 'CDF', img: flags.cdFlag }),
    new Currency({ name: 'CHF', img: flags.liFlag }),
    new Currency({ name: 'CLF', img: flags.clFlag }),
    new Currency({ name: 'CLP', img: flags.clFlag }),
    new Currency({ name: 'CNY', img: flags.cnFlag }),
    new Currency({ name: 'COP', img: flags.coFlag }),
    new Currency({ name: 'CRC', img: flags.crFlag }),
    new Currency({ name: 'CUC', img: flags.cuFlag }),
    new Currency({ name: 'CUP', img: flags.cuFlag }),
    new Currency({ name: 'CVE', img: flags.cvFlag }),
    new Currency({ name: 'CZK', img: flags.czFlag }),
    new Currency({ name: 'DJF', img: flags.djFlag }),
    new Currency({ name: 'DKK', img: flags.dkFlag }),
    new Currency({ name: 'DOP', img: flags.doFlag }),
    new Currency({ name: 'DZD', img: flags.dzFlag }),
    new Currency({ name: 'EGP', img: flags.egFlag }),
    new Currency({ name: 'ERN', img: flags.erFlag }),
    new Currency({ name: 'ETB', img: flags.etFlag }),
    new Currency({ name: 'EUR', img: flags.europeanUnFlag }),
    new Currency({ name: 'FJD', img: flags.fjFlag }),
    new Currency({ name: 'FKP', img: flags.fkFlag }),
    new Currency({ name: 'GBP', img: flags.gbFlag }),
    new Currency({ name: 'GEL', img: flags.geFlag }),
    new Currency({ name: 'GGP', img: flags.gpFlag }),
    new Currency({ name: 'GHS', img: flags.ghFlag }),
    new Currency({ name: 'GIP', img: flags.giFlag }),
    new Currency({ name: 'GMD', img: flags.gmFlag }),
    new Currency({ name: 'GNF', img: flags.gnFlag }),
    new Currency({ name: 'GTQ', img: flags.gtFlag }),
    new Currency({ name: 'GYD', img: flags.gyFlag }),
    new Currency({ name: 'HKD', img: flags.hkFlag }),
    new Currency({ name: 'HNL', img: flags.hnFlag }),
    new Currency({ name: 'HRK', img: flags.hrFlag }),
    new Currency({ name: 'HTG', img: flags.htFlag }),
    new Currency({ name: 'HUF', img: flags.huFlag }),
    new Currency({ name: 'IDR', img: flags.idFlag }),
    new Currency({ name: 'ILS', img: flags.ilFlag }),
    new Currency({ name: 'IMP', img: flags.imFlag }),
    new Currency({ name: 'INR', img: flags.btFlag }),
    new Currency({ name: 'IQD', img: flags.iqFlag }),
    new Currency({ name: 'IRR', img: flags.irFlag }),
    new Currency({ name: 'ISK', img: flags.isFlag }),
    new Currency({ name: 'JEP', img: flags.jeFlag }),
    new Currency({ name: 'JMD', img: flags.jmFlag }),
    new Currency({ name: 'JOD', img: flags.joFlag }),
    new Currency({ name: 'JPY', img: flags.jpFlag }),
    new Currency({ name: 'KES', img: flags.keFlag }),
    new Currency({ name: 'KGS', img: flags.kgFlag }),
    new Currency({ name: 'KHR', img: flags.khFlag }),
    new Currency({ name: 'KMF', img: flags.kmFlag }),
    new Currency({ name: 'KPW', img: flags.kpFlag }),
    new Currency({ name: 'KRW', img: flags.krFlag }),
    new Currency({ name: 'KWD', img: flags.kwFlag }),
    new Currency({ name: 'KYD', img: flags.kyFlag }),
    new Currency({ name: 'KZT', img: flags.kzFlag }),
    new Currency({ name: 'LAK', img: flags.laFlag }),
    new Currency({ name: 'LBP', img: flags.lbFlag }),
    new Currency({ name: 'LKR', img: flags.lkFlag }),
    new Currency({ name: 'LRD', img: flags.lrFlag }),
    new Currency({ name: 'LSL', img: flags.lsFlag }),
    new Currency({ name: 'LTL', img: flags.ltFlag }),
    new Currency({ name: 'LVL', img: flags.lvFlag }),
    new Currency({ name: 'LYD', img: flags.lyFlag }),
    new Currency({ name: 'MAD', img: flags.ehFlag }),
    new Currency({ name: 'MDL', img: flags.mdFlag }),
    new Currency({ name: 'MGA', img: flags.mgFlag }),
    new Currency({ name: 'MKD', img: flags.mkFlag }),
    new Currency({ name: 'MMK', img: flags.mmFlag }),
    new Currency({ name: 'MNT', img: flags.mnFlag }),
    new Currency({ name: 'MOP', img: flags.moFlag }),
    new Currency({ name: 'MRO', img: flags.mrFlag }),
    new Currency({ name: 'MUR', img: flags.muFlag }),
    new Currency({ name: 'MVR', img: flags.mvFlag }),
    new Currency({ name: 'MWK', img: flags.mwFlag }),
    new Currency({ name: 'MXN', img: flags.mxFlag }),
    new Currency({ name: 'MYR', img: flags.myFlag }),
    new Currency({ name: 'MZN', img: flags.mzFlag }),
    new Currency({ name: 'NAD', img: flags.naFlag }),
    new Currency({ name: 'NGN', img: flags.ngFlag }),
    new Currency({ name: 'NIO', img: flags.niFlag }),
    new Currency({ name: 'NOK', img: flags.noFlag }),
    new Currency({ name: 'NPR', img: flags.npFlag }),
    new Currency({ name: 'NZD', img: flags.nzFlag }),
    new Currency({ name: 'OMR', img: flags.omFlag }),
    new Currency({ name: 'PAB', img: flags.paFlag }),
    new Currency({ name: 'PEN', img: flags.peFlag }),
    new Currency({ name: 'PGK', img: flags.pgFlag }),
    new Currency({ name: 'PHP', img: flags.phFlag }),
    new Currency({ name: 'PKR', img: flags.pkFlag }),
    new Currency({ name: 'PLN', img: flags.plFlag }),
    new Currency({ name: 'PYG', img: flags.pyFlag }),
    new Currency({ name: 'QAR', img: flags.qaFlag }),
    new Currency({ name: 'RON', img: flags.roFlag }),
    new Currency({ name: 'RSD', img: flags.rsFlag }),
    new Currency({ name: 'RUB', img: flags.ruFlag }),
    new Currency({ name: 'RWF', img: flags.rwFlag }),
    new Currency({ name: 'SAR', img: flags.saFlag }),
    new Currency({ name: 'SBD', img: flags.sbFlag }),
    new Currency({ name: 'SCR', img: flags.scFlag }),
    new Currency({ name: 'SDG', img: flags.sdFlag }),
    new Currency({ name: 'SEK', img: flags.seFlag }),
    new Currency({ name: 'SGD', img: flags.sgFlag }),
    new Currency({ name: 'SHP', img: flags.gpFlag }),
    new Currency({ name: 'SLL', img: flags.slFlag }),
    new Currency({ name: 'SOS', img: flags.soFlag }),
    new Currency({ name: 'SRD', img: flags.srFlag }),
    new Currency({ name: 'STD', img: flags.stFlag }),
    new Currency({ name: 'SVC', img: flags.svFlag }),
    new Currency({ name: 'SYP', img: flags.syFlag }),
    new Currency({ name: 'SZL', img: flags.szFlag }),
    new Currency({ name: 'THB', img: flags.thFlag }),
    new Currency({ name: 'TJS', img: flags.tjFlag }),
    new Currency({ name: 'TMT', img: flags.tmFlag }),
    new Currency({ name: 'TND', img: flags.tnFlag }),
    new Currency({ name: 'TOP', img: flags.toFlag }),
    new Currency({ name: 'TRY', img: flags.trFlag }),
    new Currency({ name: 'TTD', img: flags.ttFlag }),
    new Currency({ name: 'TWD', img: flags.twFlag }),
    new Currency({ name: 'TZS', img: flags.tzFlag }),
    new Currency({ name: 'UAH', img: flags.uaFlag }),
    new Currency({ name: 'UGX', img: flags.ugFlag }),
    new Currency({ name: 'UYU', img: flags.uyFlag }),
    new Currency({ name: 'UZS', img: flags.uzFlag }),
    new Currency({ name: 'VEF', img: flags.veFlag }),
    new Currency({ name: 'VND', img: flags.vnFlag }),
    new Currency({ name: 'VUV', img: flags.vuFlag }),
    new Currency({ name: 'WST', img: flags.wsFlag }),
    new Currency({ name: 'XAF', img: flags.cfFlag }),
    new Currency({ name: 'XCD', img: flags.dmFlag }),
    new Currency({ name: 'XDR', img: flags.usFlag }),
    new Currency({ name: 'XOF', img: flags.ciFlag }),
    new Currency({ name: 'XPF', img: flags.wfFlag }),
    new Currency({ name: 'YER', img: flags.yeFlag }),
    new Currency({ name: 'ZAR', img: flags.zaFlag }),
    new Currency({ name: 'ZMK', img: flags.zmFlag }),
    new Currency({ name: 'ZMW', img: flags.zmFlag }),
    new Currency({ name: 'ZWL', img: flags.zwFlag })
  ].sort((a, b) => {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    return 0;
  })
];

/**
 * @typedef currency
 * @type {Object}
 * @property {String} name - Currency name for display
 * @property {String} value - Value for currency
 * @property {String} img - path to currency flag
 *
 * @param {String|String[]} val - currency name
 * @returns {currency|currency[]} Currency
 */
export const getCurrency = val => {
  try {
    if (typeof val === 'string')
      return allCurrencies.find(c => c.name.includes(val.toUpperCase().trim()));
    return allCurrencies.filter(c =>
      val.find(v => c.name === v.toUpperCase().trim())
    );
  } catch {
    return {};
  }
};

/**
 * Returns array of Currency values with icons
 */
export default allCurrencies;
