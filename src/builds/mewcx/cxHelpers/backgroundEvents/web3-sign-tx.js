/* eslint-disable no-undef */
import { KEYSTORE as keyStoreType } from '@/wallets/bip44/walletTypes';
import { WalletInterface } from '@/wallets';
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';
import { Transaction } from 'ethereumjs-tx';
import { WEB3_SIGN_TX, CX_SEND_SIGNED_TX } from '../cxEvents';
export default async ({ event, payload }, res, next) => {
  if (event !== WEB3_SIGN_TX) return next();
  const worker = new walletWorker();
  const signer = payload.signer;
  const password = payload.password;
  const txParams = payload.params;
  const globChrome = chrome;
  globChrome.storage.sync.get(signer, item => {
    const parsedItem = JSON.parse(item[signer]);
    const keystore = JSON.parse(parsedItem.priv);

    worker.postMessage({
      type: 'unlockWallet',
      data: [keystore, password]
    });

    worker.onmessage = function(e) {
      const wallet = new WalletInterface(
        Buffer.from(e.data._privKey),
        false,
        keyStoreType
      );
      signTransaction(wallet);
    };

    worker.onerror = function(e) {
      res({ error: e });
    };

    const signTransaction = function(wallet) {
      const newTx = new Transaction(txParams);
      wallet
        .signTransaction(newTx)
        .then(signedTx => {
          const newPayload = {
            signedTx: signedTx.rawTransaction,
            raw: txParams
          };
          console.log(newPayload, globChrome);
          globChrome.runtime.sendMessage(
            globChrome.runtime.id,
            { event: CX_SEND_SIGNED_TX, payload: newPayload },
            {},
            signResponse => {
              console.log(signResponse);
              if (signResponse.hasOwnProperty('message')) {
                res({ message: signResponse.message });
              }
              res({ signResponse });
            }
          );
        })
        .catch(e => {
          res({ message: e });
        });
    };
  });
};
