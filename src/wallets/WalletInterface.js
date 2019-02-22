import {
  getBufferFromHex,
  getSignTransactionObject,
  sanitizeHex,
  calculateChainIdFromV
} from './utils';
import {
  hashPersonalMessage,
  publicToAddress,
  toBuffer,
  bufferToHex,
  ecsign,
  isValidPrivate,
  isValidPublic,
  privateToPublic
} from 'ethereumjs-util';
import ethTx from 'ethereumjs-tx';
import { toChecksumAddress } from '@/helpers/addressUtils';
class WalletInterface {
  constructor(key, isPub = false, identifier) {
    this.identifier = identifier;
    if (!isPub) {
      const _privKey = Buffer.isBuffer(key)
        ? key
        : getBufferFromHex(sanitizeHex(key));
      if (!isValidPrivate(_privKey))
        throw new Error(
          'Private key does not satisfy the curve requirements (ie. it is invalid)'
        );
      this.privateKey = _privKey;
      this.publicKey = privateToPublic(_privKey);
      this.isPubOnly = false;
    } else {
      const _pubKey = Buffer.isBuffer(key) ? key : getBufferFromHex(key);
      if (_pubKey.length !== 20 && !isValidPublic(_pubKey, true))
        throw new Error('Invalid public key');
      if (_pubKey.length === 20) this.isAddress = true;
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
    return bufferToHex(this.getPrivateKey());
  }

  getPublicKey() {
    if (this.isAddress) throw new Error('Address only wallet');
    return this.publicKey;
  }

  getPublicKeyString() {
    return bufferToHex(this.getPublicKey());
  }

  getAddress() {
    if (this.isAddress) return this.publicKey;
    return publicToAddress(this.publicKey, true);
  }

  getAddressString() {
    return bufferToHex(this.getAddress());
  }

  getChecksumAddressString() {
    return toChecksumAddress(this.getAddressString());
  }
  signTransaction(txParams, signer) {
    if (this.isPubOnly && typeof signer !== 'function')
      throw new Error('public key only wallets needs a signer');
    return new Promise((resolve, reject) => {
      if (!this.isPubOnly) {
        const tx = new ethTx(txParams);
        const networkId = tx._chainId;
        tx.sign(this.privateKey);
        const signedChainId = calculateChainIdFromV(tx.v);
        if (signedChainId !== networkId)
          throw new Error(
            'Invalid networkId signature returned. Expected: ' +
              networkId +
              ', Got: ' +
              signedChainId,
            'InvalidNetworkId'
          );
        resolve(getSignTransactionObject(tx));
      } else {
        signer(txParams)
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
        const msgHash = hashPersonalMessage(toBuffer(msg));
        const signed = ecsign(msgHash, this.privateKey);
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
