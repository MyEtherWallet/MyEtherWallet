/* eslint-disable no-undef */
import { CX_SEND_SIGNED_TX } from '../cxEvents';
import store from '@/store';
export default async ({ event, payload }, callback, next) => {
  if (event !== CX_SEND_SIGNED_TX) return next();
  let funcHash = '';
  const listenerFunc = id => {
    if (id === 'mew-cx-tx-success') {
      chrome.tabs.create({
        url: store.state.network.type.blockExplorerTX.replace(
          '[[txHash]]',
          funcHash
        )
      });
    } else {
      chrome.tabs.create({
        url: 'https://github.com/MyEtherWallet/MyEtherWallet/issues/new'
      });
    }
  };
  console.log('gets here');
  store.state.web3.eth
    .sendSignedTransaction(payload.signedTx)
    .once('transactionHash', hash => {
      funcHash = hash;
      console.log('got here for sure?');
      callback(hash);
    })
    .once('receipt', res => {
      chrome.notifications.create('mew-cx-tx-success', {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('img/icons/icon192.png'),
        title: 'Transaction confirmed!',
        message: `Transaction with hash ${res.blockHash} has been mined!`
      });
      store.dispatch('addNotification', [
        'Receipt',
        payload.raw.from,
        payload.raw,
        res
      ]);
    })
    .on('error', err => {
      chrome.notifications.create('mew-cx-tx-error', {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('img/icons/icon192.png'),
        title: 'Something went wrong!',
        message: `Your transaction with hash ${funcHash} failed with error: ${err}`
      });
      store.dispatch('addNotification', [
        'Error',
        payload.raw.from,
        payload.raw,
        err
      ]);
    });
  chrome.notifications.onClicked.addListener(listenerFunc);
  chrome.notifications.onClicked.addListener(listenerFunc);
};
