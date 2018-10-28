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

const requireExtraId = ['XRP', 'STEEM', 'SBD', 'XLM', 'DCT', 'XEM']

export { changellyAddresses, requireExtraId };
