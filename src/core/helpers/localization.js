export const currencyToNumber = currency =>
  typeof currency === 'string'
    ? parseFloat(currency.replace(/[,$₽]/g, ''))
    : currency;

export const localizeCurrency = ({
  locale = 'ru-RU',
  currency = 'USD',
  number = '0.00'
}) => {
  number = typeof number === 'string' ? currencyToNumber(number) : number;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol'
  }).format(number);
};
