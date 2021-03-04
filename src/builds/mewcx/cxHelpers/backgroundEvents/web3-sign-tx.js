/* eslint-disable no-undef */
import { KEYSTORE as keyStoreType } from '@/wallets/bip44/walletTypes';
import { WalletInterface } from '@/wallets';
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';
import { Transaction } from 'ethereumjs-tx';
import { WEB3_SIGN_TX } from '../cxEvents';
import store from '@/store';
import { toChecksumAddress } from '@/helpers/addressUtils';
const KNOWN_ERRORS = {
  'Uncaught Error: Key derivation failed - possibly wrong passphrase':
    'Password incorrect! Please provide correct password!'
};
export default async ({ event, payload }, callback, next) => {
  if (event !== WEB3_SIGN_TX) return next();
  const worker = new walletWorker();
  const signer = toChecksumAddress(payload.signer);
  const password = payload.password;
  const txParams = payload.params;
  const globChrome = chrome;
  let errored = false;
  let funcHash = '';

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
  globChrome.storage.sync.get(signer, item => {
    const parsedItem = JSON.parse(item[signer]);
    const keystore =
      typeof parsedItem.priv !== 'string'
        ? parsedItem.priv
        : JSON.parse(parsedItem.priv);

    worker.postMessage({
      type: 'unlockWallet',
      data: [keystore, password]
    });

    worker.onmessage = function (e) {
      const wallet = new WalletInterface(
        Buffer.from(e.data._privKey),
        false,
        keyStoreType
      );
      signTransaction(wallet);
    };

    worker.onerror = function (e) {
      const actualError = JSON.stringify(e, ['message']);
      const parsedError = JSON.parse(actualError);
      if (parsedError.message && parsedError.message !== '') {
        const errObj = {
          message:
            KNOWN_ERRORS[parsedError.message] &&
            KNOWN_ERRORS[parsedError.message] !== ''
              ? KNOWN_ERRORS[parsedError.message]
              : parsedError.message
        };
        callback({ error: errObj });
      } else {
        callback({
          error: {
            message:
              'Something went wrong! Please try again or contact our support at support@myetherwallet.com'
          }
        });
      }
    };

    const signTransaction = async function (wallet) {
      const newTx = new Transaction(txParams);
      try {
        const signedTx = await wallet.signTransaction(newTx);
        store.state.main.web3.eth
          .sendSignedTransaction(signedTx.rawTransaction)
          .once('transactionHash', hash => {
            funcHash = hash;
            store.dispatch('main/addNotification', [
              'Hash',
              store.state.main.web3.utils.toChecksumAddress(txParams.from),
              txParams,
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
              store.state.main.web3.utils.toChecksumAddress(txParams.from),
              txParams,
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
              store.state.main.web3.utils.toChecksumAddress(txParams.from),
              txParams,
              err
            ]);
            callback(err);
          });
        chrome.notifications.onClicked.addListener(listenerFunc);
      } catch (error) {
        callback({ message: error });
      }
    };
  });
};
