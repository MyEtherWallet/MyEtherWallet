const configs = {
  url: 'https://nft.mewapi.io', // 'https://9bcq984094.execute-api.us-west-2.amazonaws.com/dev',
  countPerPage: 9,
  cryptoKittiesContract: '0x06012c8cf97bead5deae237070f9587f8e7a266d',
  mainnet: 'ETH',
  api: 'https://mainnet.mewwallet.dev'
};

const API = 'https://partners.mewapi.io/nfts';

const chainIDToNetwork = {
  1: 'ethereum',
  137: 'polygon',
  56: 'bsc'
};

export const GET_ALL_NFTS = {
  1: `${API}/owners?chains=ethereum&queried_wallet_balances=1&wallet_addresses=`,
  137: `${API}/owners?chains=polygon&queried_wallet_balances=1&wallet_addresses=`,
  56: `${API}/owners?chains=bsc&queried_wallet_balances=1&wallet_addresses=`
};
export const GET_ALL_COLLECTIONS = {
  1: `${API}/collections_by_wallets?chains=ethereum&wallet_addresses=`,
  137: `${API}/collections_by_wallets?chains=polygon&wallet_addresses=`,
  56: `${API}/collections_by_wallets?chains=bsc&wallet_addresses=`
};

/**
 * Get all NFTs by Contract Address
 * @param {Number} chainID Chain ID for the current network
 * @param {String} collection_ids IDs of the collections
 * @param {String} wallet_address Owner address of NFTs
 * @returns URL to fetch NFTs for the collection
 */
export const GET_NFTS_BY_COLLECTION = (
  chainID,
  collection_ids,
  wallet_address
) => {
  if (chainID !== 1 && chainID !== 137 && chainID !== 56)
    throw new Error('Cannot fetch NFTs on this network!');
  const chain = chainIDToNetwork[chainID];
  return `${API}/owners?chains=${chain}&collection_ids=${collection_ids}&count=1&queried_wallet_balances=1&wallet_addresses=${wallet_address}`;
};

export default configs;
