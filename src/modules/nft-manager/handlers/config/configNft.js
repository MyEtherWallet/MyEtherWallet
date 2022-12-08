const configs = {
  url: 'https://nft.mewapi.io', // 'https://9bcq984094.execute-api.us-west-2.amazonaws.com/dev',
  countPerPage: 9,
  cryptoKittiesContract: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
  mainnet: 'ETH',
  api: 'https://mainnet.mewwallet.dev'
};

const API = 'https://partners.mewapi.io/nfts';

export const chains = {
  1: `${API}/owners?chains=ethereum&queried_wallet_balances=1&wallet_addresses=`,
  137: `${API}/owners?chains=polygon&queried_wallet_balances=1&wallet_addresses=`,
  56: `${API}/owners?chains=bsc&queried_wallet_balances=1&wallet_addresses=`
};
export const getByTokenID = {
  1: `${API}/ethereum`,
  137: `${API}/polygon`,
  56: `${API}/bsc`
};

export default configs;
