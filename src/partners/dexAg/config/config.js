import { swapNotificationStatuses as notificationStatuses } from '../../partnersConfig/config';

const changellyMethods = {
  ETH: {
    currencies: 'getCurrencies',
    currenciesFull: 'getCurrenciesFull',
    rate: 'getExchangeAmount',
    min: 'getMinAmount',
    validate: 'validateAddress',
    createTransaction: 'createTransaction',
    status: 'getStatus',
    createFixTransaction: 'createFixTransaction',
    getFixRate: 'getFixRate'
  }
};

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

const TIME_SWAP_VALID = 300;
const PROVIDER_NAME = 'dexag';
const FEE_RATE = 0;
const PROXY_CONTRACT_ADDRESS = '0x05c449fb434183ef6702e3ff137c1e13cb90943e';
const requireExtraId = ['XRP', 'STEEM', 'SBD', 'XLM', 'DCT', 'XEM'];

export {
  PROXY_CONTRACT_ADDRESS,
  notificationStatuses,
  changellyMethods,
  statuses,
  requireExtraId,
  TIME_SWAP_VALID,
  PROVIDER_NAME,
  FEE_RATE
};
