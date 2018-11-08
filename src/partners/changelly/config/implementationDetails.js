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
  // ROP: 'https://tracker.kyber.network/api/tokens/supported?chain=ropsten'
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

/*
* waiting	Transaction is waiting for an incoming payment.
confirming	We have received payin and are waiting for certain amount of confirmations depending of incoming currency.
exchanging	Payment was confirmed and is being exchanged.
sending	Coins are being sent to the recipient address.
finished	Coins were successfully sent to the recipient address.
failed	Transaction has failed. In most cases, the amount was less than the minimum. Please contact support and provide a transaction id.
refunded	Exchange failed and coins were refunded to user's wallet. The wallet address should be provided by user.
overdue	We did not receive any payment since 36 hours from transaction creation.
hold	Due to AML/KYC procedure, exchange may be delayed*/

const requireExtraId = ['XRP', 'STEEM', 'SBD', 'XLM', 'DCT', 'XEM'];

export { changellyAddresses, changellyStatuses, requireExtraId };
