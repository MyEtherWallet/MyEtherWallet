const changellyAddresses = {
  ETH: {
    currencies: 'https://35.160.138.139:3535/getCurrencies',
    rate: 'https://35.160.138.139:3535/getExchangeAmount',
    min: 'https://35.160.138.139:3535/getMinAmount',
    validate: 'https://35.160.138.139:3535/validateAddress',
    createTransaction: 'https://35.160.138.139:3535/createTransaction'
  }
  // ROP: 'https://tracker.kyber.network/api/tokens/supported?chain=ropsten'
};

export { changellyAddresses };
