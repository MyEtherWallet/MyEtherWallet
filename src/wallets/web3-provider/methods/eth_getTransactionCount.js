import utils from 'web3-utils';
import { toPayload } from './jsonrpc';
import EthCalls from '../web3Calls';
import store from 'store';
import BigNumber from 'bignumber.js';

export default async ({ payload, requestManager }, res, next) => {
  if (payload.method !== 'eth_getTransactionCount') return next();
  const ethCalls = new EthCalls(requestManager);
  const addr = payload.params[0];
  let cached = {};
  if (store.get(utils.sha3(addr)) === undefined) {
    cached = {
      nonce: utils.toHex(0),
      timestamp: 0
    };
    store.set(utils.sha3(addr), cached);
  } else {
    cached = store.get(utils.sha3(addr));
  }
  const timeDiff =
    Math.round((new Date().getTime() - cached.timestamp) / 1000) / 60;
  if (timeDiff > 1) {
    const liveNonce = await ethCalls.getTransactionCount(addr);
    const liveNonceBN = new BigNumber(liveNonce);
    const cachedNonceBN = new BigNumber(cached.nonce);
    if (timeDiff > 15) {
      cached = {
        nonce: utils.toHex(liveNonceBN),
        timestamp: +new Date()
      };
    } else if (liveNonceBN.isGreaterThan(cachedNonceBN)) {
      cached = {
        nonce: utils.toHex(liveNonceBN),
        timestamp: +new Date()
      };
    }
    store.set(utils.sha3(addr), cached);
  }
  res(null, toPayload(payload.id, cached.nonce));
};
