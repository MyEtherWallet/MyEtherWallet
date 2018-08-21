import * as utils from 'web3-utils'
import * as ethUtil from 'ethereumjs-util'
// import WalletInterface from '../walletInterface'
import * as crypto from 'crypto'
import * as bip39 from 'bip39'
import * as HDKey from 'hdkey'
import EthereumTx from 'ethereumjs-tx'
import HardwareWalletInterface from './hardwareWallet-interface'
import { getDerivationPath, paths } from '../../hardware/ledger/deterministicWalletPaths'

export default class MnemonicWallet extends HardwareWalletInterface {
  constructor (options) {
    super()
    this.brand = 'none'
    this.identifier = 'Mnemonic'
    this.wallet = null
    this.isMnemonic = false
    this.addressToIndexMap = {}
    this.useDefaultdPath = true
    this.userSelectedAddress = false
    this.currentWalletSet = {
      start: 0,
      limit: 5
    }
    this.HDWallet = {
      numWallets: 0,
      walletsPerDialog: 5,
      wallets: [],
      id: 0,
      hdk: null,
      dPath: ''
    }
    this.path = 'm/44\'/60\'/0\'/0' // first address: m/44'/60'/0'/0/0
    if (options) {
      this.decryptWallet(options)
    }
  }

  static unlock (options) {
    return new MnemonicWallet(options)
  }

  get compatibleChains () {
    return paths
  }

  getDerivationPath (networkShortName) {
    return getDerivationPath(networkShortName)
  }

  setActiveAddress (address, index) {
    if (this.addressToIndexMap[index] === address) {
      this.wallet = this.HDWallet.wallets[index]
    } else {
      console.warn(`Address at index ${index} does not match address ${address}`)
      console.log(this.addressToIndexMap) // todo remove dev item
      const foundIndex = Object.values(this.addressToIndexMap).indexOf(address)
      this.wallet = this.HDWallet.wallets[foundIndex]
    }
  }

  getAddress () {
    return this.wallet.address
  }

  getAddressString () {
    return ethUtil.toChecksumAddress(this.getAddress())
  }

  changeDPath (path) {
    return new Promise((resolve) => {
      this.path = path
      resolve()
    })
  }

  getAccounts (callback) {
    return new Promise((resolve, reject) => {
      try {
        let addressAsString = this.getAddressString()
        resolve(addressAsString)
      } catch (e) {
        console.error(e) // todo replace with proper error
        reject(e)
      }
    })
  }

  getMultipleAccounts (count, offset) {
    return new Promise((resolve, reject) => {
      try {
        this.getHDAddresses(this.currentWalletSet.start, this.currentWalletSet.limit, function (err, result) {
          if (err) {
            reject(err)
            return
          }
          resolve(result)
        })
      } catch (e) {
        console.error(e) // todo replace with proper error
        reject(e)
      }
    })
  }

  async signTransaction (rawTxData) {
    try {
      if (!this.wallet) throw new Error('no wallet present. wallet not have been decrypted')
      const txData = {
        nonce: rawTxData.nonce,
        gasPrice: rawTxData.gasprice || rawTxData.gasPrice ? rawTxData.gasPrice : this.defaultGasPrice,
        gas: rawTxData.gas || rawTxData.gasLimit ? rawTxData.gasLimit : this.defaultGasLimit,
        to: rawTxData.to,
        value: rawTxData.value,
        data: rawTxData.data,
        chainId: rawTxData.chainId
      }
      txData.data = txData.data === '' ? '0x' : txData.data
      let tx = new EthereumTx(txData)
      tx.sign(Buffer.from(this.wallet.privKey, 'hex'))
      txData.rawTx = JSON.stringify(txData)
      return {
        rawTx: txData,
        messageHash: tx.hash(), // figure out what exactly web3 is putting here
        v: tx.v,
        r: tx.r,
        s: tx.s,
        rawTransaction: `0x${tx.serialize().toString('hex')}`
      }
    } catch (e) {
      return e
    }
  }

  async signMessage (message) {
    try {
      if (!this.wallet) throw new Error('no wallet present. wallet may not have been decrypted')
      let thisMessage = message.data ? message.data : message

      let msg = ethUtil.hashPersonalMessage(ethUtil.toBuffer(thisMessage))
      let signed = ethUtil.ecsign(msg, this.wallet.privKey)
      let combined = Buffer.concat([Buffer.from(signed.r), Buffer.from(signed.s), Buffer.from([signed.v])])
      let combinedHex = combined.toString('hex')
      return '0x' + combinedHex
    } catch (e) {
      return e
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

  deriveAddress (wallet) {
    if (typeof wallet.pubKey === 'undefined') {
      return ethUtil.privateToAddress(wallet.privKey).toString('hex')
    } else {
      return ethUtil.publicToAddress(wallet.pubKey, true).toString('hex')
    }
  }

  // can be accessed via the accessWallet property of MewCore
  decryptWallet (options) {
    try {
      if (!bip39.validateMnemonic(options.mnemonicPhrase)) throw new Error('Invalid Mnemonic Supplied')
      this.HDWallet.hdk = HDKey.fromMasterSeed(bip39.mnemonicToSeed(options.mnemonicPhrase.trim(), options.mnemonicPassword))
      this.setHDAddresses()
      if (options.retrieveIndex) {
        this.getSingleHDAddresses(options.retrieveIndex)
        this.setHDWallet(0)
      }
    } catch (e) {
      throw e
      // throw"fromFile decryptWallet catch" +
    }

    if (this.wallet !== null) {
      // errors.simpleError("fromFile decryptWallet this.wallet !== null")
      this.wallet.type = 'default'
    }
  };

  // TODO implement balance retrieval for HD wallet addresses (on creation)
  setHDAddresses (start = 0, limit = 5) {
    this.currentWalletSet = {
      start: start,
      limit: limit
    }

    this.HDWallet.wallets = []
    for (let i = start; i < start + limit; i++) {
      const tempWallet = this.createWallet(this.HDWallet.hdk.derive(this.path + '/' + i)._privateKey)
      tempWallet.address = this.deriveAddress(tempWallet)
      this.addressToIndexMap[i] = tempWallet.address
      this.HDWallet.wallets.push(tempWallet)
      this.HDWallet.wallets[this.HDWallet.wallets.length - 1].type = 'addressOnly'
      // this.HDWallet.web3-wallets[this.HDWallet.web3-wallets.length - 1].setBalance(false);
    }

    this.HDWallet.id = 0
    this.HDWallet.numWallets = start + limit
  }

  setHDWallet (index) {
    try {
      this.userSelectedAddress = true
      this.wallet = this.HDWallet.wallets[index]
    } catch (e) {
      console.error(e)
    }
  }

  getHDAddresses (start = 0, limit = 5, callback) {
    if (this.HDWallet.hdk) {
      let addressArray = []
      if (start !== this.currentWalletSet.start || limit !== this.currentWalletSet.limit) {
        this.setHDAddresses(start, limit)
        for (let i = 0; i < this.HDWallet.wallets.length; i++) {
          addressArray.push(utils.toChecksumAddress(this._getAddress(this.HDWallet.wallets[i])))
        }
      } else {
        for (let i = 0; i < this.HDWallet.wallets.length; i++) {
          addressArray.push(utils.toChecksumAddress(this._getAddress(this.HDWallet.wallets[i])))
        }
      }
      if (typeof callback !== 'function') {
        return addressArray
      } else {
        callback(null, [...addressArray])
      }
    }
  }

  getSingleHDAddresses (start = 0, callback) {
    if (this.HDWallet.hdk) {
      let addressArray = []
      this.HDWallet.wallets.unshift(this.createWallet(this.HDWallet.hdk.derive(this.path + '/' + start)._privateKey))
      this.HDWallet.wallets[0].type = 'addressOnly'
      utils.toChecksumAddress(this._getAddress(this.HDWallet.wallets[0]))
      if (typeof callback !== 'function') {
        return addressArray
      } else {
        callback(null, addressArray)
      }
    }
  }

  _getAddress (wallet) {
    if (typeof wallet.pubKey === 'undefined') {
      return '0x' + ethUtil.privateToAddress(wallet.privKey).toString('hex')
    } else {
      return '0x' + ethUtil.publicToAddress(wallet.pubKey, true).toString('hex')
    }
  }

  fixPkey (key) {
    if (key.indexOf('0x') === 0) {
      return key.slice(2)
    }
    return key
  }

  decipherBuffer (decipher, data) {
    return Buffer.concat([decipher.update(data), decipher.final()])
  }

  decodeCryptojsSalt (input) {
    let ciphertext = Buffer.from(input, 'base64')
    if (ciphertext.slice(0, 8).toString() === 'Salted__') {
      return {
        salt: ciphertext.slice(8, 16),
        ciphertext: ciphertext.slice(16)
      }
    } else {
      return {
        ciphertext: ciphertext
      }
    }
  }

  // eslint-disable-next-line camelcase
  evp_kdf (data, salt, opts) {
    // A single EVP iteration, returns `D_i`, where block equlas to `D_(i-1)`

    function iter (block) {
      let hash = crypto.createHash(opts.digest || 'md5')
      hash.update(block)
      hash.update(data)
      hash.update(salt)
      block = hash.digest()
      for (let i = 1; i < (opts.count || 1); i++) {
        hash = crypto.createHash(opts.digest || 'md5')
        hash.update(block)
        block = hash.digest()
      }
      return block
    }

    let keysize = opts.keysize || 16
    let ivsize = opts.ivsize || 16
    let ret = []
    let i = 0
    while (Buffer.concat(ret).length < (keysize + ivsize)) {
      ret[i] = iter((i === 0) ? Buffer.from(0) : ret[i - 1])
      i++
    }
    let tmp = Buffer.concat(ret)
    return {
      key: tmp.slice(0, keysize),
      iv: tmp.slice(keysize, keysize + ivsize)
    }
  }
}
