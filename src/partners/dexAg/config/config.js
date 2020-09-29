import { swapNotificationStatuses as notificationStatuses } from '../../partnersConfig/config';

const statuses = {
  new: 'new',
  waiting: 'waiting',
  confirming: 'confirming',
  exchanging: 'exchanging',
  sending: 'sending',
  finished: 'finished',
  failed: 'failed',
  refunded: 'refunded',
  overdue: 'overdue',
  hold: 'hold'
};

const MARKET_IMPACT_CUTOFF = 10;
const TIME_SWAP_VALID = 300;
const PROVIDER_NAME = 'dexag';
const PROXY_CONTRACT_ADDRESS = '0xB76c291871b92A7c9e020b2511a3402A3bf0499d';
const WETH_TOKEN_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

const dexAgMethods = {
  getPrice: 'getPrice',
  getSupportedCurrencies: 'getSupportedCurrencies',
  createTransaction: 'createTransaction',
  supportedDexes: 'supportedDexes',
  excludedDexes: 'excludedDexes'
};

export {
  MARKET_IMPACT_CUTOFF,
  PROXY_CONTRACT_ADDRESS,
  WETH_TOKEN_ADDRESS,
  notificationStatuses,
  statuses,
  TIME_SWAP_VALID,
  PROVIDER_NAME,
  dexAgMethods
};
