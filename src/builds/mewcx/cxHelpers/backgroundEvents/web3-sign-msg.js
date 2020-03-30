/* eslint-disable no-undef */
import { KEYSTORE as keyStoreType } from '@/wallets/bip44/walletTypes';
import { WalletInterface } from '@/wallets';
import walletWorker from 'worker-loader!@/workers/wallet.worker.js';
import { WEB3_SIGN_MSG } from '../cxEvents';
import { toChecksumAddress } from '@/helpers/addressUtils';
export default async ({ event, payload }, callback, next) => {
  if (event !== WEB3_SIGN_MSG) return next();
  const worker = new walletWorker();
  const signer = toChecksumAddress(payload.signer);
  const password = payload.password;
  const msgToSign = payload.msg;
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
      signMsg(wallet);
    };

    worker.onerror = function(e) {
      callback({ error: e });
    };

    const signMsg = async function(wallet) {
      try {
        const signedMsg = await wallet.signMessage(msgToSign);
        callback({ data: '0x' + signedMsg.toString('hex') });
      } catch (e) {
        callback({ error: e });
      }
    };
  });
};
