import * as locStore from 'store';
import utils from 'web3-utils';
import BigNumber from 'bignumber.js';
import sanitizeHex from '@/core/helpers/sanitizeHex';

export default (address, network) => {
  const isTesting = locStore.get('mew-testing');
  if (!isTesting) {
    const storeKey = utils.sha3(`${network}-${address}`);
    const localStoredObj = locStore.get(storeKey);
    locStore.set(storeKey, {
      nonce: sanitizeHex(BigNumber(localStoredObj.nonce).plus(1).toString(16)),
      timestamp: localStoredObj.timestamp
    });
  }
};
