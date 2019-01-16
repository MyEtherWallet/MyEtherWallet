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

const bityFiatCurrencies = [
  { symbol: 'CHF', name: 'Swiss Franc' },
  { symbol: 'USD', name: 'US Dollar' },
  { symbol: 'EUR', name: 'Euro' }
];

const bityMethods = {
  createTransaction: 'createTransaction',
  status: 'getStatus'
};

const bityStatuses = {
  OPEN: 'OPEN',
  RCVE: 'RCVE',
  CONF: 'CONF',
  FILL: 'FILL',
  EXEC: 'EXEC',
  CANC: 'CANC'
};

const bityRateEndpoint = 'https://bity.com/api/v1/rate2/';

const TIME_SWAP_VALID = 600;
const BITY_MIN = 0.01;
const BITY_MAX = 3;
const BITY_DECIMALS = 6;
const PROVIDER_NAME = 'bity';

export {
  bityStatuses,
  BityCurrencies,
  bityRateEndpoint,
  bityMethods,
  bityFiatCurrencies,
  TIME_SWAP_VALID,
  PROVIDER_NAME,
  BITY_MIN,
  BITY_MAX,
  BITY_DECIMALS
};
