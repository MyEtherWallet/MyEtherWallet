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
    this.networkId = this.defaultNetworkId
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
  }

  setActiveAddress (address, index) {
    this.wallet = {}
    this.wallet.address = address
    // this.activeAddressIndex = index
    this.wallet.path = this.path + '/' + index
    this.wallet.hwType = this.brand
    this.wallet.hwTransport = undefined
    this.wallet.type = this.identifier
  }

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

  signTransaction (/* txData */) {
    let txData = {
      'nonce': '0x02',
      'gasPrice': '0x098bca5a00',
      'gas': '0x5208',
      'to': '0x98217e2170648Cc73d3d3824c08AA1C4A2521947',
      'value': '0x0de0b6b3a7640000',
      'data': '0x',
      'chainId': 1,
      'v': '0x26',
      'r': '0x01ca200f3501b482a1060a0c48d365a0f59fc443aa7c6be6169d45b51d0a3a3d',
      's': '0x7e76e382ffb318bfdac92c8318b61fbd1659030a67dcfcdcb9711911887f9068'
    }
    return new Promise((resolve, reject) => {
      this.signTxTrezor(txData, (signedTx) => {
        resolve(signedTx)
      })
    })
    // throw new Error('ERROR: signTransaction NOT IMPLEMENTED');
  }

  signMessage (msgParams, callback) {
    let stringMessage = this.checkIfMessageCouldBeHexThenEnsureAscii(msgParams.data)
    this.signMessageTrezor(stringMessage, callback)
  }

  decryptWallet () {
    return this.scanTrezor()
  }

  async _getAccounts (count, offset) {
    return new Promise((resolve, reject) => {
      if (!this.decrypted) {
        this.isAvailableWait()
          .then(() => {
            this.getHDAddresses(count, offset)
              .then(addresses => {
                resolve(addresses)
              })
          })
      } else {
        this.getHDAddresses(count, offset)
          .then(addresses => {
            console.log(addresses) // todo remove dev item
            resolve(addresses)
          })
      }
    })
  }

  getHDAddresses (_accountsLength, _accountsOffset) {
    return new Promise((resolve, reject) => {
      try {
        const accountsOffset = _accountsOffset || this.accountsOffset
        const accountsLength = _accountsLength || this.accountsLength
        const addresses = {}
        this.HDWallet.wallets = []
        for (var i = accountsOffset; i < accountsOffset + accountsLength; i++) {
          var derivedKey = this.HDWallet.hdk.derive('m/' + i)
          const tempWallet = this.createWallet(undefined, derivedKey.publicKey, this.HDWallet.dPath + '/' + i, 'trezor')
          this.HDWallet.wallets.push(tempWallet)
          this.HDWallet.wallets[this.HDWallet.wallets.length - 1].type = 'addressOnly'
          const sddress = this._getAddressForWallet(tempWallet)
          this.addressToPathMap[sddress] = this.HDWallet.dPath + '/' + i
          addresses[i] = sddress
        }
        this.HDWallet.id = 0
        this.HDWallet.numWallets = accountsOffset + accountsLength
        resolve(addresses)
      } catch (e) {
        reject(e)
      }
    })
  }

  isAvailableWait () {
    let countAttempts = 0
    return new Promise((resolve, reject) => {
      let interval = setInterval(() => {
        countAttempts++
        if (this.decrypted) {
          clearInterval(interval)
          resolve()
        } else if (this.trezorError) {
          clearInterval(interval)
          reject(this.trezorErrorString)
        } else if (countAttempts > 20) {
          clearInterval(interval)
          reject(Error('Unable to connect to Trezor'))
        }
      }, 1000)
    })
  }

  async scanTrezor (isUnlocked) {
    let _this = this
    // trezor is using the path without change level id
    return new Promise(async (resolve, reject) => {
      TrezorConnect.getXPubKey(this.path, function (response) {
        if (response.success) {
          _this.HDWallet.hdk = new HDKey()
          _this.HDWallet.hdk.publicKey = Buffer.from(response.publicKey, 'hex')
          _this.HDWallet.hdk.chainCode = Buffer.from(response.chainCode, 'hex')
          _this.decrypted = true
          if (_this.trezorError) {
            _this.trezorError = false
            _this.trezorErrorString = undefined
          }
          _this.getHDAddresses()
            .then(addresses => {
              resolve(addresses)
            })
        } else {
          _this.trezorError = true
          _this.trezorErrorString = response.error
          reject(response.error)
        }
      }, '1.5.2')
    })
  };

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

  decimalToHex (dec) {
    return new utils.BN(dec).toString(16)
  }

  signTxTrezor (rawTx, callback) {
    rawTx.chainId = 1
    let _this = this
    var localCallback = function (result) {
      if (!result.success) {
        if (callback !== undefined) {
          callback({
            isError: true,
            error: result.error
          })
        }
        return
      }

      rawTx.v = '0x' + _this.decimalToHex(result.v)
      rawTx.r = '0x' + result.r
      rawTx.s = '0x' + result.s
      var eTx = new EthereumjsTx(rawTx)
      rawTx.rawTx = JSON.stringify(rawTx)
      rawTx.rawTransaction = '0x' + eTx.serialize().toString('hex')
      rawTx.isError = false
      console.log(rawTx) // todo remove dev item
      callback(rawTx)
    }

    TrezorConnect.signEthereumTx(
      'm/44\'/60\'/0\'/0',
      _this.getNakedAddress(rawTx.nonce),
      _this.getNakedAddress(rawTx.gasPrice),
      _this.getNakedAddress(rawTx.gas),
      _this.getNakedAddress(rawTx.to),
      _this.getNakedAddress(rawTx.value),
      _this.getNakedAddress(rawTx.data),
      rawTx.chainId,
      localCallback
    )
  }

  // signTxTrezor (fullTxObj) {
  //   console.log(this.wallet) // todo remove dev item
  //
  //   // console.log(rawTx) // todo remove dev item
  //   // return new Promise((resolve, reject) => {
  //   //   let _path = this.wallet.path
  //   //   var localCallback = function (result) {
  //   //     if (!result.success) {
  //   //       reject(Error(result.error))
  //   //       return
  //   //     }
  //   //
  //   //     rawTx.v = '0x' + utils.toHex(result.v)
  //   //     rawTx.r = '0x' + result.r
  //   //     rawTx.s = '0x' + result.s
  //   //     var eTx = new EthereumjsTx(rawTx)
  //   //     rawTx.rawTx = JSON.stringify(rawTx)
  //   //     rawTx.rawTransaction = '0x' + eTx.serialize().toString('hex')
  //   //     rawTx.isError = false
  //   //     console.log(eTx.toJSON()) // todo remove dev item
  //   //     resolve(rawTx)
  //   //   }
  //   //
  //   //   TrezorConnect.signEthereumTx(
  //   //     _path,
  //   //     this.getNakedAddress(rawTx.nonce),
  //   //     this.getNakedAddress(rawTx.gasPrice),
  //   //     this.getNakedAddress(rawTx.gas),
  //   //     this.getNakedAddress(rawTx.to),
  //   //     this.getNakedAddress(rawTx.value),
  //   //     this.getNakedAddress(rawTx.data),
  //   //     1,
  //   //     localCallback
  //   //   )
  //   // })
  //   return new Promise((resolve, reject) => {
  //     console.log(fullTxObj) // todo remove dev item
  //     let _path = this.wallet.path
  //     const localCallback = (result) => {
  //       if (!result.success) {
  //         console.log(result) // todo remove dev item
  //         reject(result.error)
  //         return
  //       }
  //       console.log(result) // todo remove dev item
  //       let signedTxObject = {...fullTxObj}
  //       // fullTxObj.v = '0x' + utils.numberToHex(result.v)
  //       // fullTxObj.r = '0x' + result.r
  //       // fullTxObj.s = '0x' + result.s
  //       signedTxObject.chainId = 1
  //       signedTxObject.v = Buffer.from(result.v.toString(), 'hex')
  //       signedTxObject.r = Buffer.from('0x' + result.r, 'hex')
  //       signedTxObject.s = Buffer.from('0x' + result.s, 'hex')
  //       // eslint-disable-next-line new-cap
  //       let tx = new EthereumjsTx(signedTxObject)
  //       signedTxObject.messageHash = tx.hash()
  //       signedTxObject.rawTx = JSON.stringify(fullTxObj)
  //       signedTxObject.rawTransaction = `0x${tx.serialize().toString('hex')}`
  //       console.log(tx.serialize().toString('hex')) // todo remove dev item
  //       // fullTxObj.isError = false
  //
  //       // EIP155: v should be chain_id * 2 + {35, 36}
  //       const signedChainId = Math.floor((result.v - 35) / 2)
  //       const validChainId = this.networkId & 0xff // FIXME this is to fixed a current workaround that app don't support > 0xff
  //       console.log(tx.v[0], signedChainId, validChainId) // todo remove dev item
  //       if (signedChainId !== validChainId) {
  //         throw Error(
  //           'Invalid networkId signature returned. Expected: ' +
  //           this.networkId +
  //           ', Got: ' +
  //           signedChainId,
  //           'InvalidNetworkId'
  //         )
  //       }
  //       const signedTransaction = {
  //         rawTx: JSON.stringify(fullTxObj),
  //         messageHash: tx.hash(), // figure out what exactly web3 is putting here
  //         v: signedTxObject.v,
  //         r: signedTxObject.r,
  //         s: signedTxObject.s,
  //         rawTransaction: signedTxObject.rawTransaction
  //       }
  //       console.log(signedTransaction) // todo remove dev item
  //       resolve(signedTransaction)
  //       // resolve(signedTxObject)
  //     }
  //
  //     fullTxObj.chainId = 1 // todo remove dev item
  //     console.log(fullTxObj) // todo remove dev item
  //     TrezorConnect.ethereumSignTx(
  //       _path,
  //       this.getNakedAddress(fullTxObj.nonce),
  //       this.getNakedAddress(fullTxObj.gasPrice),
  //       this.getNakedAddress(fullTxObj.gas),
  //       this.getNakedAddress(fullTxObj.to),
  //       this.getNakedAddress(fullTxObj.value),
  //       this.getNakedAddress(fullTxObj.data),
  //       fullTxObj.chainId,
  //       localCallback
  //     )
  //   })
  // }

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
    let naked = address.toLowerCase().replace('0x', '')
    console.log(naked.length % 2) // todo remove dev item
    return naked
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
      this.HDWallet.wallets.push(this.createWallet(undefined, derivedKey.publicKey, this.brand, this.HDWallet.dPath + '/' + i))
      this.HDWallet.wallets[this.HDWallet.wallets.length - 1].type = 'addressOnly'
      // this.HDWallet.web3-wallets[this.HDWallet.web3-wallets.length - 1].setBalance(false);\
      console.log(this.HDWallet.wallets) // todo remove dev item
    }
    this.HDWallet.id = 0
    this.HDWallet.numWallets = start + limit
  }

  HWWalletCreate (publicKey, chainCode, walletType, path) {
    this.HDWallet.hdk = new HDKey()
    this.HDWallet.hdk.publicKey = Buffer.from(publicKey, 'hex')
    this.HDWallet.hdk.chainCode = Buffer.from(chainCode, 'hex')
    this.HDWallet.numWallets = 0
    this.HDWallet.dPath = path
    this.setHDAddresses(this.HDWallet.numWallets, this.HDWallet.walletsPerDialog, walletType)
  }

  _getAddressForWallet (wallet) {
    if (typeof wallet.pubKey === 'undefined') {
      return '0x' + ethUtil.privateToAddress(wallet.privKey).toString('hex')
    } else {
      return '0x' + ethUtil.publicToAddress(wallet.pubKey, true).toString('hex')
    }
  }
}
