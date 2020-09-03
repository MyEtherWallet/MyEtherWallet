import WalletInterface from './WalletInterface';
import { KEYSTORE as keyStoreType } from './bip44/walletTypes';
import walletWorker from 'worker-loader!@/plugins/wallet.worker.js';
import { walletRequirePass, createBlob } from './helpers.js';
import Wallet from 'ethereumjs-wallet';

export default class Keystore {
  constructor(online, windowWorker, origin) {
    this.online = online;
    this.windowWorker = windowWorker;
    this.origin = origin;
  }

  unlock(jsonFile, password) {
    const needsPw = walletRequirePass(jsonFile);
    return new Promise((resolve, reject) => {
      if (!needsPw && !(password === '' || password.length === 0)) {
        if (this.online && this.worker && this.origin) {
          const worker = new walletWorker();

          worker.postMessage({
            type: 'unlockWallet',
            data: [jsonFile, password]
          });
          worker.onmessage = function (e) {
            const obj = {
              file: jsonFile,
              name: e.data.filename
            };
            const newWallet = new WalletInterface(
              Buffer.from(e.data._privKey),
              false,
              keyStoreType,
              '',
              JSON.stringify(obj)
            );

            resolve(newWallet);
          };

          worker.onerror = function (e) {
            reject(e);
          };
        } else {
          const newFile = {};
          Object.keys(jsonFile).forEach(key => {
            newFile[key.toLowerCase()] = jsonFile[key];
          });
          const _wallet = Wallet.fromV3(newFile, this.password, true);
          const newWallet = new WalletInterface(
            Buffer.from(_wallet._privKey),
            false,
            keyStoreType
          );

          resolve(newWallet);
        }
      } else {
        reject(new Error('Missing password!'));
      }
    });
  }

  generate(password) {
    return new Promise((resolve, reject) => {
      if (this.online && this.worker && this.origin) {
        const worker = new walletWorker();
        worker.postMessage({ type: 'createWallet', data: [password] });
        worker.onmessage = e => {
          resolve({
            file: createBlob(e.data.walletJson, 'mime'),
            name: e.data.name.toString()
          });
        };
        worker.onerror = function (e) {
          reject(e);
        };
      } else {
        const wallet = new Wallet.generate();
        const file = wallet.toV3(password, {
          kdf: 'scrypt',
          n: 131072
        });
        const name = wallet.getV3Filename();
        resolve({
          file: createBlob(file, 'mime'),
          name: name.toString()
        });
      }
    });
  }
}
