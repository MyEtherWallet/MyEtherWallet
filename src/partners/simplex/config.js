import { mewSimplex } from '../partnersConfig';

const SimplexCurrencies = {
  fiat: {
    USD: {
      symbol: 'USD',
      name: 'US Dollar'
    },
    EUR: {
      symbol: 'EUR',
      name: 'Euro'
    }
  },
  digital: {
    BTC: {
      symbol: 'BTC',
      name: 'Bitcoin'
    },
    ETH: {
      symbol: 'ETH',
      name: 'Ether'
    }
  }
};

const MIN_FIAT = 50;
const MAX_FIAT = 20000;
const PROVIDER_NAME = 'simplex';

const host = {
  url: process.env.SIMPLEX_API_HOST || mewSimplex
};

export { SimplexCurrencies, host, MIN_FIAT, MAX_FIAT, PROVIDER_NAME };
