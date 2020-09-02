import WalletInterface from './WalletInterface';
import { KEYSTORE as keyStoreType } from './bip44/walletTypes';
import walletWorker from 'worker-loader!@/helpers/wallet.worker.js';

export default class Keystore {
  constructor(online, worker, origin) {
    this.online = online;
    this.worker = worker;
    this.origin = origin;
  }

  unlock(jsonFile, password) {
    if(this.online && this.worker && this.origin) {
      const worker = new
    }
  }
}
