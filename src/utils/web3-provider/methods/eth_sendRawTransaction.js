import { toPayload } from '../jsonrpc';
import { randomHex } from 'web3-utils';
import * as locStore from 'store';
import { v4 } from 'uuid';
export default async ({ payload, store }, res, next) => {
  if (payload.method !== 'eth_sendRawTransaction') return next();
  const val = locStore.get('mew-testing');
  if (val) {
    res(null, toPayload(payload.id, randomHex(32)));
  } else {
    if (store.getters['global/network'].type.chainID === 1) {
      const burl = 'https://broadcast.mewapi.io/eth?product=web';
      fetch(burl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_sendRawTransaction',
          params: [payload.params[0]],
          id: v4()
        })
      })
        .then(response => response.json())
        .then(jRes => {
          if (jRes.error) return next();
          return res(null, toPayload(payload.id, jRes.result));
        })
        .catch(() => next());
    } else next();
  }
};
