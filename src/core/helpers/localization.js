export const currencyToNumber = currency =>
  typeof currency === 'string'
    ? parseFloat(currency.replace(/[,$₽]/g, ''))
    : currency;

export const localizeCurrency = ({ currency = 'USD', number = '0.00' }) => {
  number = typeof number === 'string' ? currencyToNumber(number) : number;
  const locales = {
    USD: 'en-US',
    RUB: 'ru-RU'
  };
  const locale = locales[currency] ? locales[currency] : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol'
  }).format(number);
};
