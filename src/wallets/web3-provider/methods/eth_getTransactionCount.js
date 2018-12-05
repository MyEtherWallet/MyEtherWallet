import utils from 'web3-utils';
import { toPayload } from './jsonrpc';
import EthCalls from '../web3Calls';
import store from 'store';
import BN from 'bignumber.js';

export default async ({ payload, requestManager }, res, next) => {
  if (payload.method !== 'eth_getTransactionCount') return next();
  const ethCalls = new EthCalls(requestManager);
  const addr = payload.params[0];

  let storedNonce = 0;
  let fetchedNonce;
  if (store.get(utils.sha3(addr)) === undefined) {
    store.set(utils.sha3(addr), {
      nonce: utils.toHex(storedNonce),
      timestamp: 0
    });
  } else {
    storedNonce = new BN(store.get(utils.sha3(addr)).nonce);
  }

  const lastFetch =
    Math.round(
      (new Date().getTime() - store.get(utils.sha3(addr)).timestamp) / 1000
    ) / 60; // Get minutes
  if (lastFetch >= 15) {
    fetchedNonce = await ethCalls.getTransactionCount(addr);
    storedNonce = new BN(fetchedNonce).toFixed();
    store.set(utils.sha3(addr), {
      nonce: utils.toHex(storedNonce),
      timestamp: +new Date()
    });
  } else if (lastFetch < 1) {
    fetchedNonce = storedNonce;
  } else {
    fetchedNonce = await ethCalls.getTransactionCount(addr);
    if (new BN(storedNonce).isLessThan(new BN(fetchedNonce))) {
      store.set(utils.sha3(addr), {
        nonce: utils.toHex(new BN(fetchedNonce).toFixed()),
        timestamp: +new Date()
      });
    } else {
      store.set(utils.sha3(addr), {
        nonce: utils.toHex(storedNonce),
        timestamp: +new Date()
      });
    }
  }

  if (new BN(storedNonce).isGreaterThan(new BN(fetchedNonce))) {
    res(null, toPayload(payload.id, `0x${new BN(storedNonce).toString(16)}`));
  } else {
    const currentTime = store.get(utils.sha3(addr)).timestamp;
    store.set(utils.sha3(addr), {
      nonce: utils.toHex(new BN(fetchedNonce).toFixed()),
      timestamp: currentTime
    });

    res(null, toPayload(payload.id, fetchedNonce));
  }
};
