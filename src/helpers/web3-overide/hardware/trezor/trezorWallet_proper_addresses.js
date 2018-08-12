import * as utils from 'web3-utils'
import EthereumjsTx from 'ethereumjs-tx'
import * as ethUtil from 'ethereumjs-util'
import * as HDKey from 'hdkey'
import HardwareWalletInterface from '../hardwareWallet-interface'

const TrezorConnect = require('./trezorConnect_v4.js').TrezorConnect

export default class TrezorWallet extends HardwareWalletInterface {
  constructor (options) {
    super()
    console.log(HDKey) // todo remove dev item
    this.identifier = 'TrezorOne'
    this.brand = 'trezor'
    this.wallet = null

    options = options || {}
    this.useDefaultdPath = true
    this.userSelectedAddress = false
    this.decrypted = false
    this.addressToPathMap = {}

    this.HDWallet = {
      numWallets: 0,
      walletsPerDialog: 5,
      wallets: [],
      id: 0,
      hdk: null,
      dPath: ''
    }

    this.defaultOptions = {
      path: 'm/44\'/60\'/0\'/0' // 'm/44\'/60\'/0\'/0' // trezor default derivation path
    }

    const currentOptions = {
      ...this.defaultOptions,
      ...options
    }

    this.path = currentOptions.path
    this.accountsLength = currentOptions.accountsLength || this.defaultAccountsCount
    this.accountsOffset = currentOptions.accountsOffset || this.defaultAccountsOffset
    this.networkId = currentOptions.networkId || this.defaultNetworkId
    // this.pathComponents = this.obtainPathComponentsFromDerivationPath(this.path)

    this.getAccounts = this.getAccounts.bind(this)
    this.getMultipleAccounts = this.getMultipleAccounts.bind(this)
    this.signTransaction = this.signTransaction.bind(this)
    this.signMessage = this.signMessage.bind(this)

    // if (currentOptions.unlockCallback && typeof currentOptions.unlockCallback === 'function') {
    //   this.isAvailableWait()
    //     .then(() => {
    //       currentOptions.unlockCallback()
    //     })
    //     .catch((_error) => {
    //       currentOptions.unlockCallback(_error)
    //     })
    // }
  }

  obtainPathComponentsFromDerivationPath (derivationPath) {
    console.log(derivationPath) // todo remove dev item
    // check if derivation path follows 44'/60'/x'/n pattern
    const regExp = /^(m\/44'\/(?:1|60|61)'\/0'\/)(\d+)'$/
    const matchResult = regExp.exec(derivationPath)
    if (matchResult === null) {
      throw this.makeError(
        'To get multiple accounts your derivation path must follow pattern 44\'/60|61\'/n\' ',
        'InvalidDerivationPath'
      )
    }
    return {basePath: matchResult[1], index: parseInt(matchResult[2], 10)}
  }

  getAccounts (callback) {
    let _this = this
    if (arguments.length > 1 && typeof arguments[2] === 'function') {
      return _this.getMultipleAccounts(arguments[0], arguments[1])
    } else {
      console.log('CONSOLE.LOG') // todo remove dev item
      return _this._getAccounts()
    }
  }

  getMultipleAccounts (count, offset, callback) {
    // if the particular wallet does not support multiple accounts this should just return the primary account
    return this._getAccounts(count, offset)
  }

  signTransaction (txData, callback) {
    this.signTxTrezor(txData, callback)
    // throw new Error('ERROR: signTransaction NOT IMPLEMENTED');
  }

  signMessage (msgParams, callback) {
    let stringMessage = this.checkIfMessageCouldBeHexThenEnsureAscii(msgParams.data)
    this.signMessageTrezor(stringMessage, callback)
  }

  decryptWallet () {
    return this.scanTrezor()
  }

  // TODO clean up
  // Why did I do it like this? A try to make the APIs match (but as more web3-wallets are finished the current (initiate then use) could change.
  // In that case I would check when adding the wallet if the/a unlock type method is present, and call it.
  async _getAccounts (count = 5, offset = 0) {
    return new Promise((resolve, reject) => {
      return new Promise((resolve, reject) => {
        if (!this.decrypted) {
          this.isAvailableWait()
            .then(() => {
              this.getHDAddresses(count, offset)
                .then(addresses => {
                  console.warn('SCANTR', this.HDWallet)
                  resolve(addresses)
                })
            })
        } else {
          this.getHDAddresses(count, offset)
            .then(addresses => {
              console.warn('SCANTR', this.HDWallet)
              resolve(addresses)
            })
        }
      })
    })
  }

  isAvailableWait () {
    return new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        console.log('check', this.decrypted) // todo remove dev item
        if (this.decrypted) {
          clearInterval(interval)
          resolve()
        } else if (this.trezorError) {
          clearInterval(interval)
          reject(this.trezorErrorString)
        }
      }, 1000)
    })
  }

  async scanTrezor (isUnlocked) {
    // trezor is using the path without change level id
    return new Promise((resolve, reject) => {
      console.log('scanTrezor', TrezorConnect) // todo remove dev item
      console.warn('SCANTR', this.path, this.HDWallet)
      TrezorConnect.getXPubKey(this.path, (response) => {
        if (response.success) {
          this.HWWalletCreate(response.publicKey, response.chainCode, 'trezor', this.path)
          // if (!this.userSelectedAddress) {
          //   this.wallet = this.HDWallet.wallets[0]
          // }
          this.decrypted = true
          if (this.trezorError) {
            this.trezorError = false
            this.trezorErrorString = undefined
          }
          resolve(null)
        } else {
          this.trezorError = true
          this.trezorErrorString = response.error
          reject(response.error)
        }
      }, '1.5.2')
      // TrezorConnect.getXPubKey(path, this.trezorCallback.bind(this), '1.5.2');
    })
  };

  trezorCallback (response) { // callback inserted via bind
    if (response.success) {
      this.HWWalletCreate(response.publicKey, response.chainCode, 'trezor', this.getdPath())
      // callback(null);
    } else {
      this.trezorError = true
      this.trezorErrorString = response.error
      // callback(response.error);
    }
  }

  setdPath (path, start = 0, limit = 5) {
    if (this.HDWallet.hdk) {
      this.useDefaultdPath = false
      this.HDWallet.dPath = path
      this.setHDAddresses(start, limit)
    }
  }

  setHDWallet (index) {
    try {
      this.userSelectedAddress = true
      this.wallet = this.HDWallet.wallets[index]
    } catch (e) {
      console.error(e)
    }
  }

  unlockTrezor (callback) {
    let _this = this
    TrezorConnect.open(function (error) {
      if (error) {
        if (callback !== undefined) {
          // eslint-disable-next-line standard/no-callback-literal
          callback({
            isError: true,
            error: error
          })
        }
      } else {
        _this.trezorUnlocked = true
        console.log('trezor unlocked')
        // eslint-disable-next-line standard/no-callback-literal
        callback('unlocked trezor')
        // txData.trezorUnlocked = true;
        // uiFuncs.generateTx(txData, callback);
      }
    })
  }

  trezorUnlockCallback (txData, callback) {
    TrezorConnect.open(function (error) {
      if (error) {
        if (callback !== undefined) {
          // eslint-disable-next-line standard/no-callback-literal
          callback({
            isError: true,
            error: error
          })
        }
      } else {
        txData.trezorUnlocked = true
        // uiFuncs.generateTx(txData, callback);
      }
    })
  }

  signTxTrezor (fullTxObj, callback) {
    let _path = this.getdPath()
    var localCallback = function (result) {
      if (!result.success) {
        if (callback !== undefined) {
          callback(result.error)
        }
        return
      }

      fullTxObj.v = '0x' + utils.numberToHex(result.v)
      fullTxObj.r = '0x' + result.r
      fullTxObj.s = '0x' + result.s
      // eslint-disable-next-line new-cap
      var eTx = new EthereumjsTx(fullTxObj)
      fullTxObj.rawTx = JSON.stringify(fullTxObj)
      fullTxObj.signedTx = '0x' + eTx.serialize().toString('hex')
      fullTxObj.isError = false
      if (callback !== undefined) callback(null, fullTxObj.signedTx)
    }

    TrezorConnect.ethereumSignTx(
      _path,
      this.getNakedAddress(fullTxObj.nonce),
      this.getNakedAddress(fullTxObj.gasPrice),
      this.getNakedAddress(fullTxObj.gas),
      this.getNakedAddress(fullTxObj.to),
      this.getNakedAddress(fullTxObj.value),
      this.getNakedAddress(fullTxObj.data),
      fullTxObj.chainId,
      localCallback
    )
  }

  signMessageTrezor (stringMessage, callback) {
    console.log('msgParams', stringMessage) // todo remove dev item
    console.log(this.wallet) // todo remove dev item

    var localCallback = function (result) {
      if (!result.success) {
        if (callback !== undefined) {
          callback(result.error)
        }
        return
      }
      console.log('response', result) // todo remove dev item
      let signedMessage = '0x' + result.signature
      if (callback !== undefined) callback(null, signedMessage)
    }
    console.log(stringMessage) // todo remove dev item
    TrezorConnect.ethereumSignMessage(this.wallet.path, stringMessage, localCallback, '1.5.2')
  }

  getNakedAddress (address) {
    return address.toLowerCase().replace('0x', '')
  }

  checkIfMessageCouldBeHexThenEnsureAscii (message) {
    if (this.isValidHex(message)) {
      return Buffer.from(message, 'hex').toString('ascii')
    } else if (this.isValidHex('0x' + message)) {
      let tempString = '0x' + message
      return Buffer.from(tempString, 'hex').toString('ascii')
    } else {
      return message
    }
  }

  isValidHex (data) {
    const hexRegex = /^[0-9A-Fa-f]+$/g
    const isString = typeof data === 'string'
    if (!isString) return false
    const isHexPrefixed = data.slice(0, 2) === '0x'
    if (!isHexPrefixed) return false
    const nonPrefixed = data.slice(2)
    const isValid = nonPrefixed.match(hexRegex)
    return isValid
  }

  getdPath () {
    if (this.useDefaultdPath) {
      return this.defaultDPath
    } else {
      return this.HDWallet.dPath
    }
  }

  createWallet (priv, pub, path, hwType, hwTransport) {
    let wallet = {}
    if (typeof priv !== 'undefined') {
      wallet.privKey = priv.length === 32 ? priv : Buffer.from(priv, 'hex')
    }
    wallet.pubKey = pub
    wallet.path = path
    wallet.hwType = hwType
    wallet.hwTransport = hwTransport
    wallet.type = 'default'
    return wallet
  }

  setHDAddresses (start = 0, limit = 5) {
    this.currentWalletSet = {
      start: start,
      limit: limit
    }
    this.HDWallet.wallets = []
    for (var i = start; i < start + limit; i++) {
      var derivedKey = this.HDWallet.hdk.derive('m/' + i)
      const tempWallet = this.createWallet(undefined, derivedKey.publicKey, this.HDWallet.dPath + '/' + i, 'trezor')
      this.HDWallet.wallets.push(tempWallet)
      this.HDWallet.wallets[this.HDWallet.wallets.length - 1].type = 'addressOnly'
      console.log(tempWallet) // todo remove dev item
      this.addressToPathMap[this._getAddressForWallet(tempWallet)] = this.HDWallet.dPath + '/' + i
      // this.HDWallet.web3-wallets[this.HDWallet.web3-wallets.length - 1].setBalance(false);
    }
    this.HDWallet.id = 0
    this.HDWallet.numWallets = start + limit
    console.log(this.addressToPathMap) // todo remove dev item
  }

  HWWalletCreate (publicKey, chainCode, walletType, path) {
    this.HDWallet.hdk = new HDKey()
    this.HDWallet.hdk.publicKey = Buffer.from(publicKey, 'hex')
    this.HDWallet.hdk.chainCode = Buffer.from(chainCode, 'hex')
    this.HDWallet.numWallets = 0
    this.HDWallet.dPath = path
    this.setHDAddresses(this.HDWallet.numWallets, this.HDWallet.walletsPerDialog, walletType)
  }

  getHDAddresses (start = 0, limit = 5, callback) {
    return new Promise((resolve, reject) => {
      if (this.HDWallet.hdk) {
        let addressArray = []
        if (start !== this.currentWalletSet.start || limit !== this.currentWalletSet.limit) {
          this.setHDAddresses(start, limit)
          for (let i = 0; i < this.HDWallet.wallets.length; i++) {
            addressArray.push(this._getAddressForWallet(this.HDWallet.wallets[i]))
          }
        } else {
          for (let i = 0; i < this.HDWallet.wallets.length; i++) {
            addressArray.push(this._getAddressForWallet(this.HDWallet.wallets[i]))
          }
        }
        console.log(addressArray) // todo remove dev item
        resolve(addressArray)
      }
    })
  }

  _getAddressForWallet (wallet) {
    if (typeof wallet.pubKey === 'undefined') {
      return '0x' + ethUtil.privateToAddress(wallet.privKey).toString('hex')
    } else {
      return '0x' + ethUtil.publicToAddress(wallet.pubKey, true).toString('hex')
    }
  }
}
