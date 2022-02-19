import BigNumber from 'bignumber.js';
import { isBigNumber } from 'web3-utils';

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
    ? new BigNumber(number).times(rate)
    : new BigNumber(number).times(rate).toFixed(2);
  return convertNumber({ locale, currency, options, convertedPrice });
};

export const currencyToNumber = currency =>
  typeof currency === 'string'
    ? parseFloat(currency.replace(/[,$₽]/g, ''))
    : currency;

const convertNumber = ({ locale, currency, options, convertedPrice }) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    ...options
  }).format(convertedPrice);

const locales = {
  USD: 'en-US',
  RUB: 'ru-RU',
  CNY: 'zh_CN'
};
