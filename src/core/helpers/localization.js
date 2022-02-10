export const localizeCurrency = ({
  locale = 'en-US',
  currency = 'USD',
  number = '0.00'
}) => {
  number =
    typeof number === 'string'
      ? parseFloat(number.replace(/[,$₽]/g, ''))
      : number;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol'
  }).format(number);
};
