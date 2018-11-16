const changellyAddresses = {
  ETH: {
    currencies: '/getCurrencies',
    rate: '/getExchangeAmount',
    min: '/getMinAmount',
    validate: '/validateAddress',
    createTransaction: '/createTransaction',
    status: '/statusChangelly'
  }
  // ROP: 'https://tracker.kyber.network/api/tokens/supported?chain=ropsten'
};

export { changellyAddresses };
