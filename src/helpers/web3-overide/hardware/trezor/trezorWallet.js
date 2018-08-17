import EthereumjsTx from 'ethereumjs-tx'
import * as ethUtil from 'ethereumjs-util'
import * as HDKey from 'hdkey'
import HardwareWalletInterface from '../hardwareWallet-interface'

const TrezorConnect = require('./trezorConnect_v4.js').TrezorConnect

export default class TrezorWallet extends HardwareWalletInterface {
  constructor (options) {
    super()
    this.identifier = 'TrezorOne'
    this.brand = 'trezor'
    this.wallet = null

    options = options || {}
    this.addressToWalletMap = {}
    this.addressesToIndexMap = {}
    this.walletsRetrieved = []

    this.id = 0
    this.hdk = null
    this.numWallets = 0

    this.defaultOptions = {
      path: 'm/44\'/60\'/0\'/0' // trezor default derivation path
    }
    const currentOptions = {
      ...this.defaultOptions,
      ...options
    }

    this.path = currentOptions.path
    this.accountsLength = currentOptions.accountsLength || this.defaultAccountsCount
    this.accountsOffset = currentOptions.accountsOffset || this.defaultAccountsOffset
    this.networkId = currentOptions.networkId || this.defaultNetworkId

    this.getAccounts = this.getAccounts.bind(this)
    this.getMultipleAccounts = this.getMultipleAccounts.bind(this)
    this.signTransaction = this.signTransaction.bind(this)
    this.signMessage = this.signMessage.bind(this)
  }

  // ============== (Start) Expected Utility methods ======================

  setActiveAddress (address, index) {
    this.wallet = this.addressToWalletMap[address]
    this.wallet.address = address
  }

  static async unlock (options) {
    try {
      const wallet = new TrezorWallet(options)
      await wallet.unlockTrezor()
      return wallet
    } catch (e) {
      return e
    }
  }

  // ============== (End) Expected Utility methods ======================

  // ============== (Start) Implementation of required EthereumJs-wallet interface methods =========
  getAddress () {
    if (this.wallet) {
      return this.wallet.address
    } else {
      return null
    }
  }

  getAddressString () {
    if (this.wallet) {
      return ethUtil.toChecksumAddress(this.getAddress())
    } else {
      return null
    }
  }

  // ============== (End) Implementation of required EthereumJs-wallet interface methods ===========

  // ============== (Start) Implementation of wallet usage methods ======================
  getAccounts (callback) {
    let _this = this
    if (arguments.length > 1 && typeof arguments[2] === 'function') {
      return _this.getMultipleAccounts(arguments[0], arguments[1])
    } else {
      return _this._getAccounts()
    }
  }

  getMultipleAccounts (count, offset, callback) {
    // if the particular wallet does not support multiple accounts this should just return the primary account
    return this._getAccounts(count, offset)
  }

  signTransaction (txData) {
    return this.signTxTrezor(txData)
  }

  signMessage (msgData) {
    let thisMessage = msgData.data ? msgData.data : msgData
    return this.signMessageTrezor(thisMessage)
  }

  // ============== (End) Implementation of wallet usage methods ======================

  changeDPath (path) {
    this.path = path
    return this.unlockTrezor()
  }

  // ============== (Start) Internally used methods ======================

  // (Start) Internal setup methods
  trezorCallback (response) {
    return new Promise((resolve, reject) => {
      if (response.success) {
        this.HWWalletCreate(response.publicKey, response.chainCode, 'trezor', this.path)
        resolve()
      } else {
        reject(Error(response.error))
      }
    })
  }

  unlockTrezor () {
    return new Promise((resolve, reject) => {
      // trezor is using the path without change level id
      TrezorConnect.getXPubKey(this.path, (response) => {
        resolve(this.trezorCallback(response))
      }, '1.5.2')
    })
  };

  createWallet (priv, pub, path, hwType, hwTransport) {
    let wallet = {}
    if (typeof priv !== 'undefined') {
      wallet.privKey = priv.length === 32 ? priv : Buffer.from(priv, 'hex')
    }
    wallet.pubKey = pub
    wallet.path = path
    wallet.hwType = this.identifier
    wallet.hwTransport = hwTransport
    wallet.type = this.brand
    return wallet
  }

  HWWalletCreate (publicKey, chainCode, walletType, path) {
    this.hdk = new HDKey()
    this.hdk.publicKey = Buffer.from(publicKey, 'hex')
    this.hdk.chainCode = Buffer.from(chainCode, 'hex')
    this.numWallets = 0
    this.path = path
    this.setHDAddressesHWWallet(this.numWallets, this.accountsLength, walletType)
  }

  setHDAddressesHWWallet (start, limit, ledger) {
    this.walletsRetrieved = []
    for (var i = start; i < start + limit; i++) {
      var derivedKey = this.hdk.derive('m/' + i)
      const tempWallet = this.createWallet(undefined, derivedKey.publicKey, this.path + '/' + i)
      this.addressToWalletMap[this._getAddressForWallet(tempWallet)] = tempWallet
      this.walletsRetrieved.push(tempWallet)
      this.addressesToIndexMap[i] = this._getAddressForWallet(tempWallet)
      this.walletsRetrieved[this.walletsRetrieved.length - 1].type = 'addressOnly'
    }
    this.id = 0
    this.numWallets = start + limit
  }

  // (End) Internal setup methods

  AddRemoveHDAddresses (isAdd) {
    if (isAdd) this.setHDAddressesHWWallet(this.numWallets, this.accountsLength)
    else this.setHDAddressesHWWallet(this.numWallets - 2 * this.accountsLength, this.accountsLength)
  }

  setHDWallet () {
    this.wallet = this.walletsRetrieved[this.id]
    this.wallet.type = 'default'
  }

  // (Start) Internal methods underlying wallet usage methods
  async _getAccounts (count, offset) {
    return new Promise((resolve, reject) => {
      let collect = {}
      if (this.addressesToIndexMap[offset] && this.addressesToIndexMap[offset + count - 1]) {
        for (let i = offset; i < offset + count; i++) {
          collect[i] = this.addressesToIndexMap[i]
        }
      } else {
        this.setHDAddresses(offset, count)
        for (let i = offset; i < offset + count; i++) {
          collect[i] = this.addressesToIndexMap[i]
        }
      }
      resolve(collect)
    })
  }

  setHDAddresses (start, limit) {
    this.walletsRetrieved = []
    for (let i = start; i < start + limit; i++) {
      const tempWallet = this.createWallet(this.hdk.derive(this.path + '/' + i)._privateKey)
      this.addressToWalletMap[this._getAddressForWallet(tempWallet)] = tempWallet
      this.addressesToIndexMap[i] = this._getAddressForWallet(tempWallet)
      this.walletsRetrieved.push(tempWallet)
    }
    this.id = 0
    this.numWallets = start + limit
  }

  decimalToHex (dec) {
    return new ethUtil.BN(dec).toString(16)
  }

  signTxTrezor (rawTx) {
    return new Promise((resolve, reject) => {
      var trezorConnectSignCallback = (result) => {
        if (!result.success) {
          reject(Error(result.error))
          return
        }
        rawTx.v = '0x' + this.decimalToHex(result.v)
        rawTx.r = '0x' + result.r
        rawTx.s = '0x' + result.s
        const tx = new EthereumjsTx(rawTx)
        rawTx.rawTx = JSON.stringify(rawTx)
        resolve({
          rawTx: rawTx.rawTx,
          messageHash: tx.hash(), // figure out what exactly web3 is putting here
          v: Buffer.from(result.v.toString(), 'hex'),
          r: Buffer.from(result.r, 'hex'),
          s: Buffer.from(result.s, 'hex'),
          rawTransaction: `0x${tx.serialize().toString('hex')}`
        })
      }

      TrezorConnect.signEthereumTx(
        this.wallet.path,
        this.getNakedAddress(rawTx.nonce),
        this.getNakedAddress(rawTx.gasPrice),
        this.getNakedAddress(rawTx.gas),
        this.getNakedAddress(rawTx.to),
        this.getNakedAddress(rawTx.value),
        this.getNakedAddress(rawTx.data),
        +rawTx.chainId,
        trezorConnectSignCallback
      )
    })
  }

  signMessageTrezor (stringMessage) {
    return new Promise((resolve, reject) => {
      const localCallback = function (result) {
        if (!result.success) {
          reject(result.error)
          return
        }
        let signedMessage = '0x' + result.signature
        resolve(signedMessage)
      }
      TrezorConnect.ethereumSignMessage(this.wallet.path, stringMessage, localCallback, '1.5.2')
    })
  }

  // (End) Internal methods underlying wallet usage methods
  // (Start) Internal utility methods
  getNakedAddress (address) {
    let naked = address.toLowerCase().replace('0x', '')
    if (naked.length % 2 === 0) {
      return naked.toString()
    } else {
      return '0' + naked.toString()
    }
  }

  _getAddressForWallet (wallet) {
    if (typeof wallet.pubKey === 'undefined') {
      return '0x' + ethUtil.privateToAddress(wallet.privKey).toString('hex')
    } else {
      return '0x' + ethUtil.publicToAddress(wallet.pubKey, true).toString('hex')
    }
  }

  // (End) Internal utility methods
  // ============== (End) Internally used methods ======================
}
