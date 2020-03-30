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
const PROXY_CONTRACT_ADDRESS = '0x14FE89a8F788a84ed8c289821C56374840E46bA3';
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
