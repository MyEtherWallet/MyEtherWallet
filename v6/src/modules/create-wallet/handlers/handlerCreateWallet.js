import Wallet from 'ethereumjs-wallet';
import {
  keystoreConfig,
  createBlob,
  generateRandomNumber,
  knuthShuffle
} from './helpers';
import MnemonicTools from '@/core/helpers/mnemonicTools';
export default class CreateWallet {
  constructor() {
    this.phrase = [];
    this.verificationPhrase = null;
  }

  // Generate new keystore wallet
  generateKeystore(password) {
    return new Promise((resolve, reject) => {
      if (!password && password === '') {
        reject('Password missing or invalid!');
      }
      try {
        const createdWallet = {};
        const wallet = new Wallet.generate();
        wallet
          .toV3(password, {
            kdf: keystoreConfig.kdf,
            n: keystoreConfig.n
          })
          .then(res => {
            createdWallet.blobUrl = createBlob(res);
            createdWallet.name = wallet.getV3Filename();
            resolve(createdWallet);
          });
      } catch (e) {
        reject(e);
      }
    });
  }
  // Generate new mnemonic wallet
  generateMnemonic(length) {
    return new Promise((resolve, reject) => {
      if (length && (length === 12 || length === 24)) {
        const phrase =
          length === 12 ? MnemonicTools.phrase12() : MnemonicTools.phrase24();
        this.phrase = phrase;
        this.generateVerification(phrase);
        resolve(phrase);
      } else {
        reject('Invalid length!');
      }
    });
  }

  // Create fake words to display for validation
  generateVerification(phrase) {
    const words = MnemonicTools.phrase24();
    const idxs = [];
    while (idxs.length < 3) {
      const random = Math.floor(Math.random() * phrase.length);
      if (idxs.indexOf(random) === -1) {
        idxs.push(random);
      }
    }
    const output = idxs.map(item => {
      const arr = [
        phrase[item],
        words[generateRandomNumber(phrase.length)],
        words[generateRandomNumber(phrase.length)]
      ];
      const randomlySortedArray = knuthShuffle(arr);
      return {
        [item]: randomlySortedArray,
        itemNumber: item
      };
    });
    this.verificationPhrase = output;
  }
  // validates the selected mnemonic values
  validateMnemonic(obj) {
    return new Promise((resolve, reject) => {
      const holder = [];
      Object.keys(obj).forEach(idx => {
        const check =
          obj[idx].substring(0, obj[idx].length - 2) === this.phrase[idx];
        holder.push(check);
      });
      if (holder.includes(false)) {
        this.generateVerification(this.phrase);
        reject('Wrong values selected. Please try again!');
      } else {
        resolve(!holder.includes(false));
      }
    });
  }

  // getters
  getVerification() {
    return this.verificationPhrase;
  }
}
