const configs = {
  url: 'https://nft.mewapi.io', // 'https://9bcq984094.execute-api.us-west-2.amazonaws.com/dev',
  countPerPage: 9,
  cryptoKittiesContract: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
  mainnet: 'ETH',
  api: 'https://mainnet.mewwallet.dev'
};

const API = 'https://partners.mewapi.io/nftsv2/';

export const chains = {
  1: `${API}eth-mainnet/address/`,
  137: `${API}matic-mainnet/address/`,
  56: `${API}bsc-mainnet/address/`,
  42161: `${API}arbitrum-mainnet/address/`,
  1313161554: `${API}aurora-mainnet/address/`,
  43114: `${API}avalanche-mainnet/address/`,
  250: `${API}fantom-mainnet/address/`,
  100: `${API}gnosis-mainnet/address/`,
  1284: `${API}moonbeam-mainnet/address/`,
  1285: `${API}moonbeam-moonriver/address/`,
  10: `${API}optimism-mainnet/address/`,
  196: `${API}x1-mainnet/address/`
};

export default configs;
