const BityCurrencies = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    invalidFrom: ['REP']
  },
  ETH: {
    symbol: 'ETH',
    name: 'Ether'
  },
  REP: {
    symbol: 'REP',
    name: 'Augur'
  }
};
const bityEndpoints = {
  server: 'https://bity.myetherapi.com',
  rates: 'https://bity.com/api/v1/rate2/'
};
const name = 'bity';
export { BityCurrencies, bityEndpoints, name };
