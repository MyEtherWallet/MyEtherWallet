// import * as _ from 'lodash'
// import * as utils from 'web3-utils'
import * as ethUtil from 'ethereumjs-util'
// import EthereumWallet from 'ethereumjs-wallet'
// import { getObjectInheritance } from '../helpers'

export default class Web3WalletAdapter {
  constructor (wallet) {
    this.wallet = wallet
    this.length = 1
    this.signTransaction = this._signTransaction.bind(this)
    this.sign = this._sign.bind(this)
  }

  privateKeyAvailable () {
    return this.wallet.privateKey && (typeof this.wallet.privateKey !== 'undefined' && this.wallet.privateKey !== null)
  }

  // ============== (Start) EthereumJs-wallet interface methods ======================
  getPrivateKey () {
    if (this.privateKeyAvailable()) {
      return this.wallet.getPrivateKey()
    } else {
      return null
    }
  }

  getPrivateKeyString () {
    if (this.privateKeyAvailable()) {
      return this.wallet.getPrivateKeyString()
    } else {
      return null
    }
  }

  getPublicKey () {
    if (this.privateKeyAvailable()) {
      return this.wallet.getPublicKey()
    } else {
      return null
    }
  }

  getPublicKeyString () {
    if (this.privateKeyAvailable()) {
      return this.wallet.getPublicKeyString()
    } else {
      return null
    }
  }

  getAddress () {
    return this.wallet.getAddress()
  }

  getAddressString () {
    const address = this.wallet.getAddress()
    if (typeof address !== 'string') {
      let rawAddress = '0x' + address.toString('hex')
      return ethUtil.toChecksumAddress(rawAddress)
    } else {
      return address
    }
  }

  getChecksumAddressString () {
    return ethUtil.toChecksumAddress(this.address)
  }

  // ============== (End) EthereumJs-wallet interface methods ======================

  get privateKey () {
    if (this.privateKeyAvailable()) {
      return this.wallet.getPrivateKeyString()
    } else {
      return null
    }
  }

  get publicKey () {
    if (this.privateKeyAvailable()) {
      return this.wallet.getPublicKeyString()
    } else {
      return null
    }
  }

  get privateKeyBuffer () {
    if (this.privateKeyAvailable()) {
      return this.wallet.getPrivateKey()
    } else {
      return null
    }
  }

  get publicKeyBuffer () {
    if (this.privateKeyAvailable()) {
      return this.wallet.getPublicKey()
    } else {
      return null
    }
  }

  get accounts () {
    return {
      privateKey: this.privateKey,
      privateKeyBuffer: this.privateKeyBuffer,
      publicKey: this.publicKey,
      publicKeyBuffer: this.publicKeyBuffer,
      address: this.address
    }
  }

  get address () {
    return this.wallet.getAddressString()
  }

  get checkSumAddress () {
    return ethUtil.toChecksumAddress(this.address)
  }

  _signTransaction (tx, privateKey) {
    return new Promise((resolve, reject) => {
      var error = false

      if (!tx) {
        error = new Error('No transaction object given!')

        reject(error)
      }

      // Resolve immediately if nonce, chainId and price are provided
      // if (tx.nonce !== undefined && tx.chainId !== undefined && tx.gasPrice !== undefined) {
      tx.data = tx.data ? tx.data : tx.input || '0x'
      tx.value = tx.value || '0x'
      console.log(this.wallet) // todo remove dev item
      this.wallet.signTransaction(tx)
        .then(_result => {
          resolve(_result)
        })
        .catch(_error => {
          reject(_error)
        })
      // } else {
      //   reject(Error('one or more of nonce, chainId, or gasPrice are missing'))
      // }
    })
  }

  _sign (data) {
    return new Promise((resolve, reject) => {
      this.wallet.signMessage(data)
        .then(_signedMessage => {
          resolve(_signedMessage)
        })
        .catch(_error => {
          reject(_error)
        })
    })

    // return Promise.resolve()
  }
}
