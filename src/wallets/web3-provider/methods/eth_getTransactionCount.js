import utils from 'web3-utils';
import EthCalls from '../web3Calls';
import store from 'store';

export default async ({ payload, requestManager }, res, next) => {
  if (payload.method !== 'eth_getTransactionCount') return next();
  const ethCalls = new EthCalls(requestManager);
  const addr = payload.params[0];
  const fetchedNonce = await ethCalls.getTransactionCount(addr);
  let storedNonce = 0;
  if (store.get(utils.sha3(addr)) === undefined) {
    store.set(utils.sha3(addr), {
      nonce: storedNonce,
      timestamp: +new Date()
    });
  } else {
    storedNonce = store.get(utils.sha3(addr)).nonce;
  }

  if (storedNonce > Number(fetchedNonce)) {
    res(storedNonce);
  } else if (storedNonce < Number(fetchedNonce)) {
    store.get(utils.sha3(addr)).nonce = Number(fetchedNonce);
    store.get(utils.sha3(addr)).timestamp = +new Date();

    res(fetchedNonce);
  }
  res(fetchedNonce);
};
