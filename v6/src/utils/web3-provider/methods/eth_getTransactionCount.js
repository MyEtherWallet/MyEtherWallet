import utils, { toBN } from 'web3-utils';
import { toPayload } from '../jsonrpc';
import EthCalls from '../web3Calls';
import * as locstore from 'store';
import sanitizeHex from '@/core/helpers/sanitizeHex';

export default async ({ payload, store, requestManager }, res, next) => {
  if (payload.method !== 'eth_getTransactionCount') return next();
  const ethCalls = new EthCalls(requestManager);
  const addr = payload.params[0].toLowerCase();
  let cached = {};
  const storeKey = utils.sha3(
    `${store.getters['global/network'].type.name}-${addr}`
  );
  if (!locstore.get(storeKey)) {
    cached = {
      nonce: '0x00',
      timestamp: 0
    };
    locstore.set(storeKey, cached);
  } else {
    cached = locstore.get(storeKey);
  }
  const timeDiff =
    Math.round((new Date().getTime() - cached.timestamp) / 1000) / 60;
  if (timeDiff > 1) {
    const liveNonce = await ethCalls.getTransactionCount(addr);
    const liveNonceBN = toBN(liveNonce);
    const cachedNonceBN = toBN(cached.nonce);
    if (timeDiff > 15) {
      cached = {
        nonce: sanitizeHex(liveNonceBN.toString(16)),
        timestamp: +new Date()
      };
    } else if (liveNonceBN.gt(cachedNonceBN)) {
      cached = {
        nonce: sanitizeHex(liveNonceBN.toString(16)),
        timestamp: +new Date()
      };
    }
    locstore.set(storeKey, cached);
  }
  res(null, toPayload(payload.id, cached.nonce));
};
