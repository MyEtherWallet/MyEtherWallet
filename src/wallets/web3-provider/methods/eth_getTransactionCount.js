import { sha3, toHex } from 'web3-utils';
import { toPayload } from './jsonrpc';
import EthCalls from '../web3Calls';
import store from 'store';
import BigNumber from 'bignumber.js';

export default async ({ payload, requestManager }, res, next) => {
  if (payload.method !== 'eth_getTransactionCount') return next();
  const ethCalls = EthCalls(requestManager);
  const addr = payload.params[0];

  let storedNonce = 0;
  let fetchedNonce;
  if (store.get(sha3(addr)) === undefined) {
    store.set(sha3(addr), {
      nonce: toHex(storedNonce),
      timestamp: 0
    });
  } else {
    storedNonce = new BigNumber(store.get(sha3(addr)).nonce);
  }

  const lastFetch =
    Math.round(
      (new Date().getTime() - store.get(sha3(addr)).timestamp) / 1000
    ) / 60; // Get minutes
  if (lastFetch >= 15) {
    fetchedNonce = await ethCalls.getTransactionCount(addr);
    storedNonce = new BigNumber(fetchedNonce).toFixed();
    store.set(sha3(addr), {
      nonce: toHex(storedNonce),
      timestamp: +new Date()
    });
  } else if (lastFetch < 1) {
    fetchedNonce = storedNonce;
  } else {
    fetchedNonce = await ethCalls.getTransactionCount(addr);
    if (new BigNumber(storedNonce).isLessThan(new BigNumber(fetchedNonce))) {
      store.set(sha3(addr), {
        nonce: toHex(new BigNumber(fetchedNonce).toFixed()),
        timestamp: +new Date()
      });
    } else {
      store.set(sha3(addr), {
        nonce: toHex(storedNonce),
        timestamp: +new Date()
      });
    }
  }

  if (new BigNumber(storedNonce).isGreaterThan(new BigNumber(fetchedNonce))) {
    res(
      null,
      toPayload(payload.id, `0x${new BigNumber(storedNonce).toString(16)}`)
    );
  } else {
    const currentTime = store.get(sha3(addr)).timestamp;
    store.set(sha3(addr), {
      nonce: toHex(new BigNumber(fetchedNonce).toFixed()),
      timestamp: currentTime
    });

    res(null, toPayload(payload.id, fetchedNonce));
  }
};
