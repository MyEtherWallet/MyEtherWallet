import utils from 'web3-utils';
import { toPayload } from './jsonrpc';
import EthCalls from '../web3Calls';
import store from 'store';

export default async ({ payload, requestManager }, res, next) => {
  if (payload.method !== 'eth_getTransactionCount') return next();
  const ethCalls = new EthCalls(requestManager);
  const addr = payload.params[0];
  let storedNonce = 0;
  let fetchedNonce;
  if (store.get(utils.sha3(addr)) === undefined) {
    store.set(utils.sha3(addr), {
      nonce: storedNonce,
      timestamp: +new Date()
    });
  } else {
    storedNonce = store.get(utils.sha3(addr)).nonce;
  }
  const lastFetch =
    Math.round(
      (new Date().getTime() - store.get(utils.sha3(addr)).timestamp) / 1000
    ) / 60; // Get minutes
  if (lastFetch < 1) {
    fetchedNonce = storedNonce;
  } else {
    fetchedNonce = await ethCalls.getTransactionCount(addr);
    store.set(utils.sha3(addr), {
      nonce: Number(fetchedNonce),
      timestamp: +new Date()
    });
  }

  if (storedNonce > Number(fetchedNonce)) {
    res(null, toPayload(payload.id, storedNonce.toString('hex')));
  } else if (storedNonce < Number(fetchedNonce)) {
    store.set(utils.sha3(addr), {
      nonce: Number(fetchedNonce),
      timestamp: +new Date()
    });

    res(null, toPayload(payload.id, fetchedNonce));
  }
  res(null, toPayload(payload.id, fetchedNonce));
};
