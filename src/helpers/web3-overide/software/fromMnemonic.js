import * as utils from 'web3-utils'
import * as ethUtil from 'ethereumjs-util'
// import WalletInterface from '../walletInterface'
import * as crypto from 'crypto'
import * as bip39 from 'bip39'
import * as HDKey from 'hdkey'
import EthereumTx from 'ethereumjs-tx'

export default class FromMnemonic {
  constructor (options) {
    this.identifier = 'Mnemonic'
    this.wallet = null
    this.isMnemonic = false
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
    this.defaultDPath = "m/44'/60'/0'/0" // first address: m/44'/60'/0'/0/0
    if (options) {
      this.decryptWallet(options)
    }
  }

  changeNetwork (networkId, path) {
    throw Object.create({message: 'ERROR: changeNetwork NOT IMPLEMENTED'})
  }

  setMewDefaults (defaultOptions) {
    this.defaultGasPrice = defaultOptions.gasPrice || '0x3b9aca00'
    this.defaultGasLimit = defaultOptions.gas || '0x4bc94fd7000'
  }

  getAccounts (callback) {
    try {
      let addressAsString = this.getAddressString()
      callback(null, addressAsString)
    } catch (e) {
      console.error(e) // todo replace with proper error
      callback(e)
    }
  }

  getMultipleAccounts (count, offset, callback) {
    try {
      this.getHDAddresses(this.currentWalletSet.start, this.currentWalletSet.limit, function (err, result) {
        if (err) {
          callback(err)
          return
        }
        callback(null, result)
      })
      // callback(null, addresses);
    } catch (e) {
      console.error(e) // todo replace with proper error
      callback(e)
    }
  }

  signTransaction (rawTxData, callback) {
    try {
      if (!this.wallet) throw new Error('no wallet present. wallet not have been decrypted')
      // var _this = this,
      //   error = false,
      //   result
      var txData = {
        nonce: rawTxData.nonce,
        gasPrice: rawTxData.gasprice || rawTxData.gasPrice ? rawTxData.gasPrice : this.defaultGasPrice,
        gas: rawTxData.gas || rawTxData.gasLimit ? rawTxData.gasLimit : this.defaultGasLimit,
        to: rawTxData.to,
        value: rawTxData.value,
        data: rawTxData.data,
        chainId: rawTxData.chainId
      }
      txData.data = txData.data === '' ? '0x' : txData.data
      let eTx = new EthereumTx(txData)
      eTx.sign(Buffer.from(this.wallet.privKey, 'hex'))
      txData.rawTx = JSON.stringify(txData)
      txData.signedTx = '0x' + eTx.serialize().toString('hex')
      callback(null, txData.signedTx)
    } catch (e) {
      callback(e)
    }
  }

  signMessage (message, callback) {
    try {
      if (!this.wallet) throw new Error('no wallet present. wallet may not have been decrypted')
      let thisMessage = message.data ? message.data : message

      let msg = ethUtil.hashPersonalMessage(ethUtil.toBuffer(thisMessage))
      let signed = ethUtil.ecsign(msg, this.wallet.privKey)
      let combined = Buffer.concat([Buffer.from(signed.r), Buffer.from(signed.s), Buffer.from([signed.v])])
      let combinedHex = combined.toString('hex')
      let signingAddr = this.getAddressString()
      // eslint-disable-next-line no-unused-vars
      let signedMsg = JSON.stringify({
        address: signingAddr,
        msg: thisMessage,
        sig: '0x' + combinedHex,
        version: '3',
        signer: 'MEW'
      }, null, 2)
      if (!(typeof callback === 'function')) return '0x' + combinedHex
      callback(null, '0x' + combinedHex)
    } catch (e) {
      if (!(typeof callback === 'function')) return e
      callback(e)
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

  getAddress () {
    if (!this.wallet && this.HDWallet.wallets.length === 0) throw Error('no wallet present. wallet not have been decrypted')
    if (!this.wallet) {
      if (typeof this.HDWallet.wallets[0].pubKey === 'undefined') {
        return ethUtil.privateToAddress(this.HDWallet.wallets[0].privKey)
      } else {
        return ethUtil.publicToAddress(this.HDWallet.wallets[0].pubKey, true)
      }
    } else {
      if (typeof this.wallet.pubKey === 'undefined') {
        return ethUtil.privateToAddress(this.wallet.privKey)
      } else {
        return ethUtil.publicToAddress(this.wallet.pubKey, true)
      }
    }
  }

  getAddressString () {
    return utils.toChecksumAddress('0x' + this.getAddress().toString('hex'))
  }

  // can be accessed via the accessWallet property of MewCore
  decryptWallet (options) {
    try {
      if (!bip39.validateMnemonic(options.manualmnemonic)) throw new Error('Invalid Mnemonic Supplied')
      this.HDWallet.hdk = HDKey.fromMasterSeed(bip39.mnemonicToSeed(options.manualmnemonic.trim(), options.mnemonicPassword))
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
    if (this.useDefaultdPath) {
      this.HDWallet.dPath = this.defaultDPath
    }
    this.HDWallet.wallets = []
    for (let i = start; i < start + limit; i++) {
      this.HDWallet.wallets.push(this.createWallet(this.HDWallet.hdk.derive(this.HDWallet.dPath + '/' + i)._privateKey))
      this.HDWallet.wallets[this.HDWallet.wallets.length - 1].type = 'addressOnly'
      // this.HDWallet.web3-wallets[this.HDWallet.web3-wallets.length - 1].setBalance(false);
    }

    this.HDWallet.id = 0
    this.HDWallet.numWallets = start + limit
    if (!this.userSelectedAddress) {
      this.wallet = this.HDWallet.wallets[0]
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

  // getWalletSet(start, limit){
  //   this.currentWalletSet = {
  //     start: start,
  //     limit: limit
  //   }
  // }

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
      this.HDWallet.wallets.unshift(this.createWallet(this.HDWallet.hdk.derive(this.HDWallet.dPath + '/' + start)._privateKey))
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
