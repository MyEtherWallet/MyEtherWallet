/* eslint-disable no-undef */
import { CX_SEND_SIGNED_TX } from '../cxEvents';
import store from '@/store';
export default async ({ event, payload }, callback, next) => {
  if (event !== CX_SEND_SIGNED_TX) return next();
  console.log('gets to background');
  store.state.web3.eth
    .sendSignedTransaction(payload.signedTx)
    .once('transactionHash', hash => {
      callback(hash);
    })
    .once('receipt', res => {
      store.dispatch('addNotification', [
        'Receipt',
        payload.raw.from,
        payload.raw,
        res
      ]);
    })
    .on('error', err => {
      store.dispatch('addNotification', [
        'Error',
        payload.raw.from,
        payload.raw,
        err
      ]);
    });
};
