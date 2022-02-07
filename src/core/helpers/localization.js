export const localizeCurrency = ({
  locale = 'en-US',
  currency = 'RUB',
  number
}) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol'
  }).format(parseInt(number, 10));
};
