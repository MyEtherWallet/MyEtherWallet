// import * as _ from 'lodash'
import * as utils from 'web3-utils'
// import EthereumWallet from 'ethereumjs-wallet'
// import { getObjectInheritance } from '../helpers'

export default class Web3WalletAdapter {
  constructor (wallet) {
    this.wallet = wallet
    this.length = 1
  }

  privateKeyAvailable () {
    return this.wallet.privateKey && (typeof this.wallet.privateKey !== 'undefined' && this.wallet.privateKey !== null)
  }

  // ============== (Start) EthereumJs-wallet interface methods ======================
  getPrivateKey () {
    return this.wallet.getPrivateKey()
  }

  getPrivateKeyString () {
    return this.wallet.getPrivateKeyString()
  }

  getPublicKey () {
    return this.wallet.getPublicKey()
  }

  getPublicKeyString () {
    return this.wallet.getPublicKeyString()
  }

  getAddress () {
    return this.wallet.getAddress()
  }

  getChecksumAddressString () {
    return this.wallet.getChecksumAddressString()
  }

  // ============== (End) EthereumJs-wallet interface methods ======================

  get privateKey () {
    return this.wallet.getPrivateKeyString()
  }

  get publicKey () {
    return this.wallet.getPublicKeyString()
  }

  get privateKeyBuffer () {
    return this.wallet.getPrivateKey()
  }

  get publicKeyBuffer () {
    return this.wallet.getPublicKey()
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
    return utils.toChecksumAddress(this.address)
  }

  signTransaction (tx, privateKey) {
    return new Promise((resolve, reject) => {
      var error = false

      if (!tx) {
        error = new Error('No transaction object given!')

        reject(error)
      }

      // Resolve immediately if nonce, chainId and price are provided
      if (tx.nonce !== undefined && tx.chainId !== undefined && tx.gasPrice !== undefined) {
        tx.data = tx.data ? tx.data : tx.input || '0x'
        tx.value = tx.value || '0x'

        this.wallet.signTransaction(tx)
          .then(_result => {
            resolve(_result)
          })
          .catch(_error => {
            reject(_error)
          })
      } else {
        reject(Error('one or more of nonce, chainId, or gasPrice are missing'))
      }
    })
  }

  sign (data) {
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
