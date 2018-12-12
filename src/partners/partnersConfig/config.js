const networkSymbols = {
  ETH: 'ETH',
  ROP: 'ROP'
};

const BASE_CURRENCY = 'ETH';
const baseCurrencyEntry = { symbol: 'ETH', name: 'Ether' };
const MIN_SWAP_AMOUNT = 0.000001;
const TIME_SWAP_VALID_DEFAULT = 600;

const swapApiEndpoints = {
  base: 'https://swap.mewapi.io',
  changelly: '/changelly',
  bity: '/bity'
};
const mewSimplex = 'https://apiccswap.myetherwallet.com';

export {
  BASE_CURRENCY,
  MIN_SWAP_AMOUNT,
  TIME_SWAP_VALID_DEFAULT,
  baseCurrencyEntry,
  networkSymbols,
  swapApiEndpoints,
  mewSimplex
};
