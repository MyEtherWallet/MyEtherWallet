/* eslint-disable no-undef */
import { CX_SEND_SIGNED_TX } from '../cxEvents';
import store from '@/store';
export default async ({ event, payload }, callback, next) => {
  if (event !== CX_SEND_SIGNED_TX) return next();
  let funcHash = '';
  let errored = false;
  const listenerFunc = () => {
    if (errored) {
      chrome.tabs.create({
        url: 'https://github.com/MyEtherWallet/MyEtherWallet/issues/new'
      });
    } else {
      chrome.tabs.create({
        url: store.state.main.network.type.blockExplorerTX.replace(
          '[[txHash]]',
          funcHash
        )
      });
    }
  };
  store.state.main.web3.eth
    .sendSignedTransaction(payload.signedTx)
    .once('transactionHash', hash => {
      funcHash = hash;
      store.dispatch('main/addNotification', [
        'Hash',
        store.state.main.web3.utils.toChecksumAddress(payload.raw.from),
        payload.raw,
        hash
      ]);
      callback(hash);
    })
    .once('receipt', res => {
      errored = false;
      chrome.notifications.create('', {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('img/icons/icon192.png'),
        title: 'Transaction confirmed!',
        message: `Transaction with hash ${res.blockHash} has been mined!`
      });
      store.dispatch('main/addNotification', [
        'Receipt',
        store.state.main.web3.utils.toChecksumAddress(payload.raw.from),
        payload.raw,
        res
      ]);
    })
    .on('error', err => {
      errored = true;
      funcHash = '';
      chrome.notifications.create('', {
        type: 'basic',
        iconUrl: chrome.runtime.getURL('img/icons/icon192.png'),
        title: 'Something went wrong!',
        message: `Your transaction with hash ${funcHash} failed with error: ${err}`
      });
      store.dispatch('main/addNotification', [
        'Error',
        store.state.main.web3.utils.toChecksumAddress(payload.raw.from),
        payload.raw,
        err
      ]);
    });
  chrome.notifications.onClicked.addListener(listenerFunc);
};
