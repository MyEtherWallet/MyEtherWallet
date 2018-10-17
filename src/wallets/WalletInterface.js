import { getBufferFromHex } from './utils';
import ethUtil from 'ethereumjs-util';
import ethTx from 'ethereumjs-tx';
class WalletInterface {
  constructor(key, isPub = false) {
    if (!isPub) {
      const _privKey = Buffer.isBuffer(key) ? key : getBufferFromHex(key);
      if (!ethUtil.isValidPrivate(_privKey))
        throw new Error(
          'Private key does not satisfy the curve requirements (ie. it is invalid)'
        );
      this.privateKey = _privKey;
      this.publicKey = ethUtil.privateToPublic(_privKey);
      this.isPubOnly = false;
    } else {
      const _pubKey = Buffer.isBuffer(key) ? key : getBufferFromHex(key);
      if (!ethUtil.isValidPublic(_pubKey, true))
        throw new Error('Invalid public key');
      this.publicKey = _pubKey;
      this.isPubOnly = true;
    }
  }
  getPrivateKey() {
    if (this.isPubOnly) throw new Error('public key only wallet');
    return this.privateKey;
  }

  getPrivateKeyString() {
    if (this.isPubOnly) throw new Error('public key only wallet');
    return ethUtil.bufferToHex(this.getPrivateKey());
  }

  getPublicKey() {
    return this.publicKey;
  }

  getPublicKeyString() {
    return ethUtil.bufferToHex(this.getPublicKey());
  }

  getAddress() {
    return ethUtil.publicToAddress(this.publicKey, true);
  }

  getAddressString() {
    return ethUtil.bufferToHex(this.getAddress());
  }

  getChecksumAddressString() {
    return ethUtil.toChecksumAddress(this.getAddressString());
  }
  signTransaction(txParams, signer) {
    if (this.isPubOnly && typeof signer !== 'function')
      throw new Error('public key only wallets needs a signer');
    return new Promise((resolve, reject) => {
      const tx = new ethTx(txParams);
      if (!this.isPubOnly) {
        tx.sign(this.privateKey);
        resolve(tx);
      } else {
        signer(tx)
          .then(resolve)
          .catch(reject);
      }
    });
  }
  signMessage(msg, signer) {
    if (this.isPubOnly && typeof signer !== 'function')
      throw new Error('public key only wallets needs a signer');
    return new Promise((resolve, reject) => {
      if (!this.isPubOnly) {
        const msgHash = ethUtil.hashPersonalMessage(ethUtil.toBuffer(msg));
        const signed = ethUtil.ecsign(msgHash, this.privateKey);
        resolve(
          Buffer.concat([
            Buffer.from(signed.r),
            Buffer.from(signed.s),
            Buffer.from([signed.v])
          ])
        );
      } else {
        signer(msg)
          .then(resolve)
          .catch(reject);
      }
    });
  }
}
export default WalletInterface;
