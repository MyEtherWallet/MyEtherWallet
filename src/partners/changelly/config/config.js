const changellyAddresses = {
  ETH: {
    currencies: 'https://127.0.0.1:9100/getCurrencies',
    rate: 'https://127.0.0.1:9100/getExchangeAmount',
    min: 'https://127.0.0.1:9100/getMinAmount',
    validate: 'https://127.0.0.1:9100/validateAddress',
    createTransaction: 'https://127.0.0.1:9100/createTransaction'
  }
  // ROP: 'https://tracker.kyber.network/api/tokens/supported?chain=ropsten'
};

export { changellyAddresses };
