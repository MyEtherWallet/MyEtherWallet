import Web3 from 'web3';

/**
 * NFT transfers put the contract in the transaction's `to` and the real
 * recipient inside the calldata, so a confirmation screen that only shows
 * `tx.to` tells the user nothing about where their NFT is going. These are the
 * transfer entry points MEW itself encodes (see handlerNftManager) plus the
 * remaining standard overloads a dapp may hand us.
 */
const NFT_TRANSFERS = {
  // ERC-721
  '0x23b872dd': {
    standard: 'ERC-721',
    params: ['address', 'address', 'uint256']
  },
  '0x42842e0e': {
    standard: 'ERC-721',
    params: ['address', 'address', 'uint256']
  },
  '0xb88d4fde': {
    standard: 'ERC-721',
    params: ['address', 'address', 'uint256', 'bytes']
  },
  // ERC-1155
  '0xf242432a': {
    standard: 'ERC-1155',
    params: ['address', 'address', 'uint256', 'uint256', 'bytes'],
    amountIdx: 3
  }
};

/**
 * Decodes the recipient, token id and (ERC-1155) amount out of an NFT
 * transfer's calldata.
 * @param {string} data hex calldata
 * @returns {?{standard: string, from: string, to: string, tokenId: string,
 *   amount: ?string}} null when `data` is not a recognised NFT transfer
 */
function parseNftData(data) {
  if (typeof data !== 'string' || data.length < 10) return null;
  const transfer = NFT_TRANSFERS[data.substr(0, 10).toLowerCase()];
  if (!transfer) return null;
  try {
    const web3 = new Web3();
    const params = web3.eth.abi.decodeParameters(
      transfer.params,
      `${data.substr(10)}`
    );
    return {
      standard: transfer.standard,
      from: params[0],
      to: params[1],
      tokenId: params[2].toString(),
      amount:
        transfer.amountIdx === undefined
          ? null
          : params[transfer.amountIdx].toString()
    };
  } catch (e) {
    // Malformed or non-conforming calldata: fall back to the raw-data display
    // rather than showing a half-decoded recipient.
    return null;
  }
}

export default parseNftData;
