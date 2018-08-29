import * as utils from 'web3-utils';
import * as ethUtil from 'ethereumjs-util';
import EthereumTx from 'ethereumjs-tx';
import EthereumWallet from 'ethereumjs-wallet';

import * as crypto from 'crypto';

export default class BasicWallet {
  constructor(options) {
    this.identifier = 'Default'; // for Legacy Reasons
    this.active = false; // denotes whether the wallet was initiated with a value or not
    this.wallet = null;
    if (options) {
      this.decryptWallet(options);
    }
    return this;
  }

  static unlock(options) {
    return new BasicWallet(options);
  }

  // ============== (Start) EthereumJs-wallet interface methods ======================
  getPrivateKey() {
    return this.wallet.getPrivateKey();
  }

  getPrivateKeyString() {
    return this.wallet.getPrivateKeyString();
  }

  getPublicKey() {
    return this.wallet.getPublicKey();
  }

  getPublicKeyString() {
    return this.wallet.getPublicKeyString();
  }

  getAddress() {
    return this.wallet.getAddress();
  }

  getAddressString() {
    const rawAddress = '0x' + this.getAddress().toString('hex');
    return ethUtil.toChecksumAddress(rawAddress);
  }

  getChecksumAddressString() {
    return this.wallet.getChecksumAddressString();
  }

  // ============== (End) EthereumJs-wallet interface methods ======================

  get privateKey() {
    return this.wallet.getPrivateKeyString();
  }

  get publicKey() {
    return this.wallet.getPublicKeyString();
  }

  get privateKeyBuffer() {
    return this.wallet.getPrivateKey();
  }

  get publicKeyBuffer() {
    return this.wallet.getPublicKey();
  }

  // ================== Start Interface Methods ========================================

  getAccounts() {
    return new Promise((resolve, reject) => {
      try {
        resolve([this.getAddressString()]);
      } catch (e) {
        reject(e);
      }
    });
  }

  getMultipleAccounts() {
    return this.getAccounts();
  }

  signTransaction(txData) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.wallet)
          throw new Error(
            'no wallet present. wallet may not have been decrypted'
          );
        txData.data = txData.data === '' ? '0x' : txData.data;
        txData.data = txData.data === '' ? '0x' : txData.data;
        const eTx = new EthereumTx(txData);
        eTx.sign(this.privateKeyBuffer);
        txData.rawTx = JSON.stringify(txData);
        const serializedTx = eTx.serialize();
        txData.signedTx = `0x${serializedTx.toString('hex')}`;
        const hashedtx = eTx.hash();

        resolve({
          tx: {
            ...txData.rawTx,
            v: `0x${eTx.v.toString('hex')}`,
            r: `0x${eTx.r.toString('hex')}`,
            s: `0x${eTx.s.toString('hex')}`,
            hash: hashedtx
          },
          rawTransaction: txData.signedTx
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  signMessage(message) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.wallet)
          throw new Error(
            'no wallet present. wallet may not have been decrypted'
          );
        const thisMessage = message.data ? message.data : message;
        const hash = ethUtil.hashPersonalMessage(ethUtil.toBuffer(thisMessage));
        const signed = ethUtil.ecsign(hash, this.wallet.privKey);
        const combined = Buffer.concat([
          Buffer.from(signed.r),
          Buffer.from(signed.s),
          Buffer.from([signed.v])
        ]);
        const combinedHex = combined.toString('hex');
        resolve('0x' + combinedHex);
      } catch (e) {
        reject(e);
      }
    });
  }

  // ================== End Interface Methods ========================================

  detectWallet(params) {
    if (this._isJSON(params[0])) {
      return {
        type: 'fromPrivateKeyFile',
        fileContent: params[0],
        filePassword: params[1]
      };
    }
    if (params.length === 2) {
      return {
        type: 'fromMyEtherWalletKey',
        manualPrivateKey: params[0],
        privPassword: params[1]
      };
    }
    return {
      type: 'manualPrivateKey',
      manualPrivateKey: params[0]
    };
  }

  _isJSON(json) {
    try {
      JSON.parse(json);
      return true;
    } catch (e) {
      return false;
    }
  }

  // can be accessed via the accessWallet property of MewCore
  decryptWallet(options) {
    try {
      if (Array.isArray(options)) {
        options = this.detectWallet(options);
      }
      switch (options.type) {
        case 'fromMyEtherWalletKey': {
          // TODO: STILL NEEDS TESTS
          this.wallet = this.fromMyEtherWalletKey(
            options.manualPrivateKey,
            options.privPassword
          );
          break;
        }
        case 'manualPrivateKey': {
          if (typeof options.manualPrivateKey === 'object')
            throw new Error('Supplied Private Key Must Be A String');

          // eslint-disable-next-line
          const privKey =
            options.manualPrivateKey.indexOf('0x') === 0
              ? options.manualPrivateKey
              : '0x' + options.manualPrivateKey;

          if (!utils.isHex(options.manualPrivateKey)) {
            throw Error(
              'BasicWallet decryptWallet manualPrivateKey: Invalid Hex'
            );
          } else if (!ethUtil.isValidPrivate(ethUtil.toBuffer(privKey))) {
            this.wallet = null;
            throw Error(
              'BasicWallet decryptWallet manualPrivateKey: Invalid Private Key'
            );
          } else {
            this.wallet = BasicWallet.createWallet(
              this.fixPkey(options.manualPrivateKey)
            );
          }
          break;
        }
        case 'fromPrivateKeyFile': {
          this.wallet = this.getWalletFromPrivKeyFile(
            options.fileContent,
            options.filePassword
          );
          break;
        }
        case 'parity': {
          // TODO: STILL NEEDS TESTS
          this.wallet = this.fromParityPhrase(options.parityPhrase);
          break;
        }
        default: {
          break;
        }
      }
      this.active = true;
    } catch (e) {
      throw e;
    }

    if (this.wallet !== null) {
      this.wallet.type = 'default';
    }
  }

  static generateWallet() {
    // eslint-disable-next-line new-cap
    const tempWallet = new EthereumWallet.generate();
    const privKey = tempWallet.getPrivateKeyString();

    return new BasicWallet({
      type: 'manualPrivateKey',
      manualPrivateKey: privKey
    });
  }

  static createWallet(priv, pub, path, hwType, hwTransport) {
    let wallet = {};
    let privateKey;
    if (typeof priv !== 'undefined') {
      privateKey = priv.length === 32 ? priv : Buffer.from(priv, 'hex');
      wallet = EthereumWallet.fromPrivateKey(privateKey);
    }

    wallet.path = path;
    wallet.hwType = hwType;
    wallet.hwTransport = hwTransport;
    wallet.type = 'default';

    return wallet;
  }

  fixPkey(key) {
    if (key.indexOf('0x') === 0) {
      return key.slice(2);
    }
    return key;
  }

  getWalletFromPrivKeyFile(strjson, password) {
    let jsonArr;
    if (typeof strjson === 'string') {
      jsonArr = JSON.parse(strjson);
    } else {
      jsonArr = strjson;
    }
    // eslint-disable-next-line new-cap
    if (jsonArr.encseed != null)
      return new EthereumWallet.fromEthSale(strjson, password);
    // eslint-disable-next-line new-cap
    else if (jsonArr.Crypto != null || jsonArr.crypto != null)
      return new EthereumWallet.fromV3(strjson, password, true);
    else if (jsonArr.hash != null)
      return this.fromMyEtherWallet(strjson, password);
    else if (jsonArr.publisher === 'MyEtherWallet')
      return this.fromMyEtherWalletV2(strjson);

    throw Error('Error decoding wallet from file');
  }

  fromMyEtherWalletKey(input, password) {
    let cipher = input.slice(0, 128);
    cipher = this.decodeCryptojsSalt(cipher);
    const evp = this.evp_kdf(Buffer.from(password), cipher.salt, {
      keysize: 32,
      ivsize: 16
    });
    const decipher = crypto.createDecipheriv('aes-256-cbc', evp.key, evp.iv);
    let privKey = this.decipherBuffer(decipher, Buffer.from(cipher.ciphertext));
    privKey = new this(privKey.toString(), 'hex');
    return BasicWallet.createWallet(privKey);
  }

  fromMyEtherWallet(input, password) {
    const json = typeof input === 'object' ? input : JSON.parse(input);
    let privKey;
    if (!json.locked) {
      if (json.private.length !== 64) {
        throw new Error('Invalid private key length');
      }
      privKey = Buffer.from(json.private, 'hex');
    } else {
      if (typeof password !== 'string') {
        throw new Error('Password required');
      }
      if (password.length < 7) {
        throw new Error('Password must be at least 7 characters');
      }
      let cipher = json.encrypted ? json.private.slice(0, 128) : json.private;
      cipher = this.decodeCryptojsSalt(cipher);
      const evp = this.evp_kdf(Buffer.from(password), cipher.salt, {
        keysize: 32,
        ivsize: 16
      });
      const decipher = ethUtil.crypto.createDecipheriv(
        'aes-256-cbc',
        evp.key,
        evp.iv
      );
      privKey = this.decipherBuffer(decipher, Buffer.from(cipher.ciphertext));
      privKey = Buffer.from(privKey.toString(), 'hex');
    }
    const wallet = BasicWallet.createWallet(privKey);
    if (wallet.getAddressString() !== json.address) {
      throw new Error('Invalid private key or address');
    }
    return wallet;
  }

  fromMyEtherWalletV2(input) {
    const json = typeof input === 'object' ? input : JSON.parse(input);
    if (json.privKey.length !== 64) {
      throw new Error('Invalid private key length');
    }

    const privKey = Buffer.from(json.privKey, 'hex');
    return BasicWallet.createWallet(privKey);
  }

  fromParityPhrase(phrase) {
    let hash = ethUtil.sha3(Buffer.from(phrase));
    for (let i = 0; i < 16384; i++) hash = ethUtil.sha3(hash);
    // eslint-disable-next-line eqeqeq
    while (ethUtil.privateToAddress(hash)[0] != 0) hash = ethUtil.sha3(hash);
    return BasicWallet.createWallet(hash);
  }

  decipherBuffer(decipher, data) {
    return Buffer.concat([decipher.update(data), decipher.final()]);
  }

  decodeCryptojsSalt(input) {
    const ciphertext = Buffer.from(input, 'base64');
    if (ciphertext.slice(0, 8).toString() === 'Salted__') {
      return {
        salt: ciphertext.slice(8, 16),
        ciphertext: ciphertext.slice(16)
      };
    }
    return {
      ciphertext: ciphertext
    };
  }

  // eslint-disable-next-line camelcase
  evp_kdf(data, salt, opts) {
    // A single EVP iteration, returns `D_i`, where block equlas to `D_(i-1)`

    function iter(block) {
      let hash = crypto.createHash(opts.digest || 'md5');
      hash.update(block);
      hash.update(data);
      hash.update(salt);
      block = hash.digest();
      for (let i = 1; i < (opts.count || 1); i++) {
        hash = crypto.createHash(opts.digest || 'md5');
        hash.update(block);
        block = hash.digest();
      }
      return block;
    }

    const keysize = opts.keysize || 16;
    const ivsize = opts.ivsize || 16;
    const ret = [];
    let i = 0;
    while (Buffer.concat(ret).length < keysize + ivsize) {
      ret[i] = iter(i === 0 ? Buffer.from(0) : ret[i - 1]);
      i++;
    }
    const tmp = Buffer.concat(ret);
    return {
      key: tmp.slice(0, keysize),
      iv: tmp.slice(keysize, keysize + ivsize)
    };
  }
}
