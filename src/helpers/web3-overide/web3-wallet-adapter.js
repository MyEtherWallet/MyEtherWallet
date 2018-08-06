import * as _ from 'lodash'
import * as utils from 'web3-utils'
import EthereumWallet from 'ethereumjs-wallet'
// import { getObjectInheritance } from '../helpers'

var isNot = function (value) {
  return (_.isUndefined(value) || _.isNull(value))
}

export default class Web3WalletAdapter {
  constructor (wallet) {
    // if (!getObjectInheritance(wallet).includes('WalletInterface')) throw Error('Wallets must include WalletInterface in prototype chain')
    this.wallet = wallet
    this.length = 1
  }

  setEthereumCall (_ethereumCall) {
    this._ethereumCall = _ethereumCall
  }

  privateKeyAvailable () {
    return this.wallet.privateKey && (typeof this.wallet.privateKey !== 'undefined' && this.wallet.privateKey !== null)
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

  get publicKey () {
    return this.wallet.publicKey
  }

  get publicKeyBuffer () {
    if (this.wallet.publicKey) {
      return Buffer.from(this.wallet.publicKey, 'hex')
    } else {
      return null
    }
  }

  get privateKey () {
    if (this.privateKeyAvailable()) {
      const tempPrivateKey = this.wallet.privateKey
      if (typeof tempPrivateKey !== 'string') return true
      if (tempPrivateKey.slice(0, 2) === '0x') {
        return tempPrivateKey
      } else {
        return '0x' + tempPrivateKey
      }
    } else {
      return true
    }
  }

  get privateKeyBuffer () {
    if (this.privateKeyAvailable()) {
      // if (this.wallet.privateKey) {
      console.log('private key buffer') // todo remove dev item
      return Buffer.from(this.wallet.privateKey, 'hex')
      // } else {
      //   return null
      // }
    } else {
      return null
      // return Buffer.from([], 'hex')
    }
  }

  get address () {
    return this.wallet.getAddressString()
  }

  get checkSumAddress () {
    return utils.toChecksumAddress(this.address)
  }

  fillInMissing (tx) {
    return new Promise((resolve, reject) => {
      Promise.all([
        isNot(tx.chainId) ? this._ethereumCall.getId() : tx.chainId,
        isNot(tx.gasPrice) ? this._ethereumCall.getGasPrice() : tx.gasPrice,
        isNot(tx.nonce) ? this._ethereumCall.getTransactionCount(this.address) : tx.nonce // || _this.privateKeyToAccount(privateKey).address) : tx.nonce
      ])
        .then((args) => {
          if (isNot(args[0]) || isNot(args[1]) || isNot(args[2])) {
            throw new Error('One of the values "chainId", "gasPrice", or "nonce" couldn\'t be fetched: ' + JSON.stringify(args))
          }
          let chainId
          if (typeof args[0] === 'number') {
            chainId = args[0]
          } else {
            chainId = args[0].slice(0, 2) === '0x' ? args[0].slice(2) : args[0]
          }
          resolve(this.wallet.signTransaction(_.extend(tx, {
            chainId: chainId,
            gasPrice: args[1],
            nonce: args[2]
          })))
        })
        .catch(_error => {
          reject(_error)
        })
    })
  }

  signTransaction (tx, privateKey, callback = function () {}) {
    return new Promise((resolve, reject) => {
      var error = false
      if (privateKey && typeof privateKey === 'function') {
        callback = privateKey
      }
      if (!tx) {
        error = new Error('No transaction object given!')

        callback(error)
        reject(error)
      }

      // if (tx.to) {
      //   tx.to = utils.toChecksumAddress(tx.to)
      // }
      //
      // if (tx.from) {
      //   tx.from = utils.toChecksumAddress(tx.from)
      // }

      // Resolve immediately if nonce, chainId and price are provided
      if (tx.nonce !== undefined && tx.chainId !== undefined && tx.gasPrice !== undefined) {
        tx.data = tx.data ? tx.data : tx.input || '0x'
        tx.value = tx.value || '0x'

        console.log('all values present') // todo remove dev item
        this.wallet.signTransaction(tx)
          .then(_result => {
            callback(_result)
            resolve(_result)
          })
          .catch(_error => {
            callback(_error)
            reject(_error)
          })
      }

      this.fillInMissing(tx)
        .then(_result => {
          callback(_result)
          resolve(_result)
        })
        .catch(_error => {
          callback(_error)
          reject(_error)
        })
    })
  }

  // ask Kosala about the making async sync
  sign (data, callback = function () {}) {
    return new Promise((resolve, reject) => {
      try {
        const signedMessage = this.wallet.signMessage(data)
        callback(null, signedMessage)
        resolve(signedMessage)
      } catch (e) {
        callback(e)
        reject(e)
      }
    })

    // return Promise.resolve()
  }

  encrypt (password, options) {
    /* jshint maxcomplexity: 20 */
    if (this.privateKeyAvailable()) {
      const tempWallet = new EthereumWallet(this.privateKeyBuffer)
      return tempWallet.toV3(password, options)
    }
  }
}
