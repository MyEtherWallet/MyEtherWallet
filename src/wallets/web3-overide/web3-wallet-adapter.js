import * as ethUtil from 'ethereumjs-util';

export default class Web3WalletAdapter {
  constructor(wallet) {
    this.wallet = wallet;
    this.isHardwareWallet = this.wallet.type === 'hardware';
    this.identifier = wallet.identifier;
    this.brand = wallet.brand;
    // this.type = wallet.type
    this.length = 1;
    // Assign methods to external expected names, and bind to present context
    this.signTransaction = this._signTransaction.bind(this);
    this.signMessage = this._signMessage.bind(this);
  }

  // ============== (Start) EthereumJs-wallet interface methods ======================
  getPrivateKey() {
    if (this.privateKeyAvailable()) {
      return this.wallet.getPrivateKey();
    } else {
      return null;
    }
  }

  getPrivateKeyString() {
    if (this.privateKeyAvailable()) {
      return this.wallet.getPrivateKeyString();
    } else {
      return null;
    }
  }

  getPublicKey() {
    if (this.privateKeyAvailable()) {
      return this.wallet.getPublicKey();
    } else {
      return null;
    }
  }

  getPublicKeyString() {
    if (this.privateKeyAvailable()) {
      return this.wallet.getPublicKeyString();
    } else {
      return null;
    }
  }

  getAddress() {
    return this.wallet.getAddress();
  }

  getAddressString() {
    const address = this.wallet.getAddress();
    if (typeof address !== 'string') {
      let rawAddress = '0x' + address.toString('hex');
      return ethUtil.toChecksumAddress(rawAddress);
    } else {
      return address;
    }
  }

  getChecksumAddressString() {
    return ethUtil.toChecksumAddress(this.address);
  }

  // ============== (End) EthereumJs-wallet interface methods ======================
  // ============== (Start) Getters  ======================
  get privateKey() {
    if (this.privateKeyAvailable()) {
      return this.wallet.getPrivateKeyString();
    } else {
      return null;
    }
  }

  get publicKey() {
    if (this.privateKeyAvailable()) {
      return this.wallet.getPublicKeyString();
    } else {
      return null;
    }
  }

  get privateKeyBuffer() {
    if (this.privateKeyAvailable()) {
      return this.wallet.getPrivateKey();
    } else {
      return null;
    }
  }

  get publicKeyBuffer() {
    if (this.privateKeyAvailable()) {
      return this.wallet.getPublicKey();
    } else {
      return null;
    }
  }

  get accounts() {
    return {
      privateKey: this.privateKey,
      privateKeyBuffer: this.privateKeyBuffer,
      publicKey: this.publicKey,
      publicKeyBuffer: this.publicKeyBuffer,
      address: this.address
    };
  }

  get address() {
    return this.wallet.getAddressString();
  }

  get isHardware() {
    return this.isHardwareWallet;
  }

  get checkSumAddress() {
    return ethUtil.toChecksumAddress(this.address);
  }

  // ============== (End) Getters  ======================
  // ============== (Start) Operational Methods ======================

  _signTransaction(tx) {
    return new Promise((resolve, reject) => {
      if (!tx) {
        reject(new Error('No transaction object given!'));
      }
      if (this.wallet.isHardware && !tx.from)
        tx.from = this.wallet.getAddressString(); // ledgerWallet checks to see that the address is from the ledger

      tx.data = tx.data ? tx.data : tx.input || '0x';
      // if(tx.data.length > 2){
      //   if(!this.isHex(tx.data)){
      //     tx.data =
      //   }
      // }
      tx.value = tx.value || '0x';
      this.wallet
        .signTransaction(tx)
        .then(_result => {
          resolve(_result);
        })
        .catch(_error => {
          // eslint-disable-next-line no-console
          console.error(_error);
          reject(_error);
        });
    });
  }

  _signMessage(message) {
    return new Promise((resolve, reject) => {
      const msgData = { data: message };
      if (this.wallet.isHardware && !msgData.from)
        msgData.from = this.wallet.getAddressString(); // ledgerWallet checks to see that the address is from the ledger
      this.wallet
        .signMessage(msgData)
        .then(_signedMessage => {
          let signedMsg = JSON.stringify(
            {
              address: this.wallet.getAddressString(),
              msg: message,
              sig: _signedMessage,
              version: '3',
              signer: this.wallet.brand ? this.wallet.brand : 'MEW'
            },
            null,
            2
          );
          resolve(signedMsg);
        })
        .catch(_error => {
          reject(_error);
        });
    });
  }

  // ============== (End) Operational Methods ======================
  // ============== (Start) Utility Methods ======================
  privateKeyAvailable() {
    return (
      this.wallet.privateKey &&
      (typeof this.wallet.privateKey !== 'undefined' &&
        this.wallet.privateKey !== null)
    );
  }

  isHex(hex) {
    return (
      (typeof hex === 'string' || typeof hex === 'number') &&
      /^(-0x|0x)?[0-9a-f]*$/i.test(hex)
    );
  }

  // checkConnection () {
  //   if (this.isHardware) {
  //     return this.wallet.checkConnection()
  //   } else {
  //     return Promise.resolve(true)
  //   }
  // }

  // ============== (End) Utility Methods ======================
}
