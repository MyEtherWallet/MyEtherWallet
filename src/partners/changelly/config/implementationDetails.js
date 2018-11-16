const changellyAddresses = {
  ETH: {
    currencies: '/getCurrencies',
    rate: '/getExchangeAmount',
    batchRate: '/getBatchExchangeAmount',
    min: '/getMinAmount',
    batchMin: '/getBatchMinAmount',
    validate: '/validateAddress',
    createTransaction: '/createTransaction',
    status: '/statusChangelly'
  }
};

const changellyStatuses = {
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

const providerName = 'changelly';

const requireExtraId = ['XRP', 'STEEM', 'SBD', 'XLM', 'DCT', 'XEM'];

export { changellyAddresses, changellyStatuses, requireExtraId, providerName };
