const networkSymbols = {
  ETH: 'ETH',
  ROP: 'ROP'
};

const BASE_CURRENCY = 'ETH';
const baseCurrencyEntry = { symbol: 'ETH', name: 'Ether' };
const MIN_SWAP_AMOUNT = 0.000001;
const TIME_SWAP_VALID_DEFAULT = 600;

const swapApiEndpoints = {
  // base: 'https://6y37xarr8i.execute-api.us-east-1.amazonaws.com/latest',
  base: 'https://swap.mewapi.io',
  changelly: '/changelly',
  bity: '/bity'
};
const mewSimplex = 'https://apiccswap.myetherwallet.com';

const swapNotificationStatuses = {
  new: 'new',
  sent: 'sent',
  cancelled: 'cancelled',
  NEW: 'new',
  SENT: 'sent',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
  COMPLETE: 'complete',
  FAILED: 'failed'
};

export {
  BASE_CURRENCY,
  MIN_SWAP_AMOUNT,
  TIME_SWAP_VALID_DEFAULT,
  swapNotificationStatuses,
  baseCurrencyEntry,
  networkSymbols,
  swapApiEndpoints,
  mewSimplex
};
