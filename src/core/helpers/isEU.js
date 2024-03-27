const euCountries = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'EU'
];
const isEU = async () => {
  try {
    const req = await fetch('https://partners.mewapi.io/ip-info')
      .then(res => res.json())
      .then(res =>
        euCountries.findIndex(item => {
          if (item === res.country) return item;
        })
      );
    return req > -1;
  } catch (e) {
    return false;
  }
};

export default isEU;
