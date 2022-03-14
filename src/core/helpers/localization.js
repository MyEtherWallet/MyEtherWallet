import BigNumber from 'bignumber.js';
import { isBigNumber } from 'web3-utils';

/***********************************************
 * Localizes numbers to its specified currency *
 * Returns String                              *
 ***********************************************/
export const localizeCurrency = ({
  currency = 'USD',
  number = '0.00',
  rate = 1,
  small = false,
  verySmall = false
}) => {
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

  const locale = locales[currency] ? locales[currency] : 'en-US';

  if (isNaN(number)) {
    return convertNumber({ locale, currency, options, convertedPrice: 0.0 });
  }

  const convertedPrice = small
    ? new BigNumber(number).times(rate).toFixed(6)
    : verySmall
    ? new BigNumber(number).times(rate).toFixed(7)
    : new BigNumber(number).times(rate);

  return convertNumber({ locale, currency, options, convertedPrice });
};

/****************************
 * Expects String           *
 * Converts String to Float *
 * Returns Float            *
 ****************************/
export const currencyToNumber = currency =>
  typeof currency === 'string'
    ? parseFloat(currency.replace(/[,$₽<\s]/g, ''))
    : currency;

/*************************************
 * Converts Number to Local Currency *
 * Returns String                    *
 *************************************/
const convertNumber = ({ locale, currency, options, convertedPrice }) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    ...options
  }).format(convertedPrice);

/******************************
 * Locale Codes From Currency *
 ******************************/
const locales = {
  USD: 'en-US',
  RUB: 'ru-RU',
  CNY: 'zh-CN',
  GBP: 'en-GB',
  EUR: 'fr-FR'
};
