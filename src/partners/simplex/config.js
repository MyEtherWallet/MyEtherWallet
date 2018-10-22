import { swapServer } from '../config';

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
    },
    BCH: {
      symbol: 'BCH',
      name: 'Bitcoin Cash'
    },
    LTC: {
      symbol: 'LTC',
      name: 'Litecoin'
    }
  }
};

const SimplexMinFiat = 50;
const SimplexMaxFiat = 20000;

const host = {
  url: process.env.API_HOST || swapServer //'https://apiccswap.myetherwallet.com'
};

export { SimplexCurrencies, host, SimplexMinFiat, SimplexMaxFiat };
