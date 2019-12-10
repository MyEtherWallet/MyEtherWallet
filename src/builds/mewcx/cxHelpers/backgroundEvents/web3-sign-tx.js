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

    const signTransaction = async function(wallet) {
      console.log(signer, password, txParams)
      const newTx = new Transaction(txParams);
      try {
        const signedTx =  await wallet.signTransaction(newTx);
        const newPayload = {
          signedTx: signedTx.rawTransaction,
          raw: txParams
        };
        console.log(globChrome.runtime.id, 'what')
        console.log(newPayload, 'the heck')
        globChrome.runtime.sendMessage(
          globChrome.runtime.id,
          { event: CX_SEND_SIGNED_TX, payload: newPayload },
          {},
          signResponse => {
            console.log(signResponse, 'for some reason you get here??');
            if (signResponse.hasOwnProperty('message')) {
              res({ message: signResponse.message });
            }
            res({ signResponse });
          }
        );
      } catch (error) {
        res({ message: error });
      }
      console.log('gets here tho?')
    };
  });
};
