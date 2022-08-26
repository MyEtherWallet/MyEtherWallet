import BigNumber from 'bignumber.js';
import { isNull } from 'lodash';
import { isBigNumber } from 'web3-utils';

/**
 * Localizes numbers to its specified currency
 * @returns {string} converted number
 */
export const localizeCurrency = ({
  currency = 'USD',
  number = '0.00',
  rate = 1,
  small = false,
  verySmall = false
}) => {
  if (isNull(number)) {
    return convertNumber({ currency, options: {}, convertedPrice: 0.0 });
  }
  const options = number.tooltipText
    ? {
        notation: 'compact',
        minimumFractionDigits: 3,
        maximumFractionDigits: 4
      }
    : small
    ? {
        notation: 'compact',
        minimumFractionDigits: 5,
        maximumFractionDigits: 6
      }
    : {};

  rate = typeof rate === 'string' ? currencyToNumber(rate) : rate;
  number =
    typeof number === 'string'
      ? currencyToNumber(number)
      : number.tooltipText
      ? currencyToNumber(number.tooltipText)
      : isBigNumber(number)
      ? currencyToNumber(number.toString())
      : number;
  //const locale = locales[currency] ? locales[currency] : 'en-US';
  if (isNaN(number)) {
    return convertNumber({ currency, options: {}, convertedPrice: 0.0 });
  }
  const convertedPrice = small
    ? new BigNumber(number).times(rate).toFixed(6)
    : verySmall
    ? new BigNumber(number).times(rate).toFixed(7)
    : new BigNumber(number).times(rate);
  return convertNumber({ currency, options, convertedPrice });
};

/**
 * Converts string representing fiat to a float
 * @param {string} currency
 * @returns {Number}
 */
export const currencyToNumber = currency =>
  typeof currency === 'string'
    ? parseFloat(currency.replace(/[,$₽<\s]/g, ''))
    : currency;

/**
 * Converts number to a local currency
 * @returns {string} Converted Number
 */
const convertNumber = ({ currency, options, convertedPrice }) => {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
      ...options
    }).format(convertedPrice);
  } catch (e) {
    throw new Error(e);
  }
};

/******************************
 * Locale Codes From Currency *
 ******************************/
//const locales = {
//USD: 'us'
// AED: 'ar-AE',
// AFN: 'prs-AF',
// ALL: 'sq-AL',
// AMD: 'hy-AM',
// ANG: 'nl-NL',
// AOA: 'ln-AO',
// ARS: 'es-AR',
// AUD: 'en-AU	',
// AWG: 'nl-AW',
// AZN: 'az-AZ',
// BAM: 'bs-BA',
// BBD: 'es-BB',
// BDT: 'bn-BD',
// BGN: 'bg-BG',
// BHD: '',
// BIF: '',
// BMD: '',
// BND: '',
// BOB: '',
// BRL: '',
// BSD: '',
// BTC: '',
// BTN: '',
// BWP: '',
// BYN: '',
// BYR: '',
// BZD: '',
// CAD: '',
// CDF: '',
// CHF: '',
// CLF: '',
// CLP: '',
// CNY: '',
// COP: '',
// CRC: '',
// CUC: '',
// CUP: '',
// CVE: '',
// CZK: '',
// DJF: '',
// DKK: '',
// DOP: '',
// DZD: '',
// EGP: '',
// ERN: '',
// ETB: '',
// EUR: '',
// FJD: '',
// FKP: '',
// GBP: '',
// GEL: '',
// GGP: '',
// GHS: '',
// GIP: '',
// GMD: '',
// GNF: '',
// GTQ: '',
// GYD: '',
// HKD: '',
// HNL: '',
// HRK: '',
// HTG: '',
// HUF: '',
// IDR: '',
// ILS: '',
// IMP: '',
// INR: '',
// IQD: '',
// IRR: '',
// ISK: '',
// JEP: '',
// JMD: '',
// JOD: '',
// JPY: '',
// KES: '',
// KGS: '',
// KHR: '',
// KMF: '',
// KPW: '',
// KRW: '',
// KWD: '',
// KYD: '',
// KZT: '',
// LAK: '',
// LBP: '',
// LKR: '',
// LRD: '',
// LSL: '',
// LTL: '',
// LVL: '',
// LYD: '',
// MAD: '',
// MDL: '',
// MGA: '',
// MKD: '',
// MMK: '',
// MNT: '',
// MOP: '',
// MRO: '',
// MUR: '',
// MVR: '',
// MWK: '',
// MXN: '',
// MYR: '',
// MZN: '',
// NAD: '',
// NGN: '',
// NIO: '',
// NOK: '',
// NPR: '',
// NZD: '',
// OMR: '',
// PAB: '',
// PEN: '',
// PGK: '',
// PHP: '',
// PKR: '',
// PLN: '',
// PYG: '',
// QAR: '',
// RON: '',
// RSD: '',
// RUB: '',
// RWF: '',
// SAR: '',
// SBD: '',
// SCR: '',
// SDG: '',
// SEK: '',
// SGD: '',
// SHP: '',
// SLL: '',
// SOS: '',
// SRD: '',
// STD: '',
// SVC: '',
// SYP: '',
// SZL: '',
// THB: '',
// TJS: '',
// TMT: '',
// TND: '',
// TOP: '',
// TRY: '',
// TTD: '',
// TWD: '',
// TZS: '',
// UAH: '',
// UGX: '',
// USD: '',
// UYU: '',
// UZS: '',
// VEF: '',
// VND: '',
// VUV: '',
// WST: '',
// XAF: '',
// XAG: '',
// XAU: '',
// XCD: '',
// XDR: '',
// XOF: '',
// XPF: '',
// YER: '',
// ZAR: '',
// ZMK: '',
// ZMW: '',
// ZWL: ''
//};
