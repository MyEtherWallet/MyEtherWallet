import * as utils from 'web3-utils'
import * as ethUtil from 'ethereumjs-util'
import EthereumTx from 'ethereumjs-tx'
import EthereumWallet from 'ethereumjs-wallet'

import * as crypto from 'crypto'
import * as scrypt from 'scryptsy'
import assert from 'assert'

import account from 'eth-lib/lib/account'
// var Account = require()
// This No Longer Has Any HD based wallet Operations
export default class BasicWallet_old {
  constructor (options) {
    this.identifier = 'Default' // for Legacy Reasons
    this.active = false // denotes whether the wallet was initiated with a value or not
    this.wallet = null
    if (options) {
      this.decryptWallet(options)
    }
    return this
  }

  getPrivateKey () {
    return this.wallet.privKey
  }

  getPublicKey () {
    return this.wallet.pubKey
  }

  get privateKeyBuffer () {
    return this.wallet.privKey
  }

  get publicKeyBuffer () {
    if (this.wallet.publicKey) {
      return Buffer.from(this.wallet.publicKey, 'hex')
    } else {
      return null
    }
  }

  _attachWallet (wallet) {
    this.privateKey = this.wallet.privKey.toString('hex')
    if (this.wallet.pubKey === undefined) {
      // console.log(this.privateKey.toString('hex')) // todo remove dev item
      this.wallet.pubKey = ethUtil.privateToPublic(this.wallet.privKey)
    }
    this.publicKey = this.wallet.pubKey.toString('hex')
    this.address = this.getAddressString()
  }

  changeNetwork (networkId, path) {
    throw Object.create({message: 'ERROR: changeNetwork NOT IMPLEMENTED'})
  }

  // ================== Start Interface Methods ========================================

  getAccounts (callback) {
    try {
      let addressAsString = this.getAddressString()
      callback(null, [addressAsString])
    } catch (e) {
      callback(e)
    }
  }

  getMultipleAccounts (count, offset, callback) {
    return this.getAccounts(callback)
  }

  convertToHex (rawTxData) {
    // TODO add check for valid hex, otherwise error
    let convertedTx = {
      to: rawTxData.to,
      data: rawTxData.data
    }

    if (rawTxData.from) convertedTx.from = rawTxData.from

    if (rawTxData.nonce) {
      if (utils.isHexStrict(rawTxData.nonce)) {
        convertedTx.nonce = rawTxData.nonce
      } else {
        convertedTx.nonce = utils.toHex(rawTxData.nonce)
      }
      // if (convertedTx.nonce === '0x0') {
      //   convertedTx.nonce = '0x00'
      // }
    }

    if (rawTxData.gasprice || rawTxData.gasPrice) {
      let gasPrice = rawTxData.gasprice || rawTxData.gasPrice
      if (utils.isHexStrict(gasPrice)) {
        convertedTx.gasPrice = gasPrice
      } else {
        convertedTx.gasPrice = utils.toHex(gasPrice)
      }
    }

    if (rawTxData.gas || rawTxData.gasLimit) {
      let gasValue = rawTxData.gas || rawTxData.gasLimit
      if (utils.isHexStrict(gasValue)) {
        convertedTx.gas = gasValue
      } else {
        convertedTx.gas = utils.toHex(gasValue)
      }
    }

    if (rawTxData.value) {
      if (utils.isHexStrict(rawTxData.value)) {
        convertedTx.value = rawTxData.value
      } else {
        convertedTx.value = utils.toHex(rawTxData.value)
      }
    }

    if (rawTxData.chainId) {
      if (typeof rawTxData.chainId === 'number') {
        convertedTx.chainId = parseInt(rawTxData.chainId) //.toString()
      } else {
        if (utils.isHexStrict(rawTxData.chainId)) {
          convertedTx.chainId = rawTxData.chainId
        } else {
          convertedTx.chainId = utils.toHex(rawTxData.chainId)
        }
      }
    }

    return convertedTx
  }

  signTransaction (rawTxData) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.wallet) throw new Error('no wallet present. wallet may not have been decrypted')
        rawTxData.data = rawTxData.data === '' ? '0x' : rawTxData.data
        let txData = this.convertToHex(rawTxData)
        // let txData = rawTxData
        txData.data = txData.data === '' ? '0x' : txData.data
        // console.log('to be signed', txData) // todo remove dev item
        let eTx = new EthereumTx(txData)
        eTx.sign(this.privateKeyBuffer)
        txData.rawTx = JSON.stringify(txData)
        const serializedTx = eTx.serialize()
        txData.signedTx = `0x${serializedTx.toString('hex')}`
        let hashedtx = eTx.hash()
        // txData.signedTx = '0x' + eTx.serialize().toString('hex')
        let result = {
          rawTx: txData.rawTx,
          messageHash: hashedtx, // figure out what exactly web3 is putting here
          v: eTx.v,
          r: eTx.r,
          s: eTx.s,
          rawTransaction: txData.signedTx
        }
        console.log(result.rawTransaction) // todo remove dev item
        resolve(result)
      } catch (e) {
        reject(e)
      }
    })
  }

  signMessage (message) {
    // return new Promise((resolve, reject) => {
    try {
      if (!this.wallet) throw new Error('no wallet present. wallet may not have been decrypted')
      let thisMessage = message.data ? message.data : message
      let hash = ethUtil.hashPersonalMessage(ethUtil.toBuffer(thisMessage))
      let signed = ethUtil.ecsign(hash, this.wallet.privKey)
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
      return {
        message: message,
        messageHash: hash,
        v: signed.v,
        r: signed.r,
        s: signed.s,
        signature: '0x' + combinedHex
      }
      // return '0x' + combinedHex
    } catch (e) {
      return e
    }
    // })
  }

  // ================== End Interface Methods ========================================

  detectWallet (params) {
    if (this._isJSON(params[0])) {
      return {
        type: 'fromPrivateKeyFile',
        fileContent: params[0],
        filePassword: params[1]
      }
    } else {
      if (params.length === 2) {
        return {
          type: 'fromMyEtherWalletKey',
          manualPrivateKey: params[0],
          privPassword: params[1]
        }
      } else {
        return {
          type: 'manualPrivateKey',
          manualPrivateKey: params[0]
        }
      }
    }
  }

  _isJSON (json) {
    try {
      JSON.parse(json)
      return true
    } catch (e) {
      return false
    }
  }

  // can be accessed via the accessWallet property of MewCore
  decryptWallet (options) {
    try {
      if (Array.isArray(options)) {
        options = this.detectWallet(options)
      }
      switch (options.type) {
        case 'fromMyEtherWalletKey': // TODO: STILL NEEDS TESTS
          this.wallet = this.fromMyEtherWalletKey(options.manualPrivateKey, options.privPassword)
          break
        case 'manualPrivateKey':
          if (typeof options.manualPrivateKey === 'object') throw new Error('Supplied Private Key Must Be A String')
          let privKey = options.manualPrivateKey.indexOf('0x') === 0 ? options.manualPrivateKey : '0x' + options.manualPrivateKey

          if (!utils.isHex(options.manualPrivateKey)) {
            throw Error('BasicWallet_old decryptWallet manualPrivateKey: Invalid Hex')
            // return;
          } else if (!ethUtil.isValidPrivate(ethUtil.toBuffer(privKey))) {
            this.wallet = null
            throw Error('BasicWallet_old decryptWallet manualPrivateKey: Invalid Private Key')
            // return;
          } else {
            this.wallet = BasicWallet_old.createWallet(this.fixPkey(options.manualPrivateKey))
            // walletService.password = '';
          }
          break
        case 'fromPrivateKeyFile':
          this.wallet = this.getWalletFromPrivKeyFile(options.fileContent, options.filePassword)
          // walletService.password = filePassword;
          break
        case 'parity': // TODO: STILL NEEDS TESTS
          this.wallet = this.fromParityPhrase(options.parityPhrase)
          break
        default:
          break
      }
      this.active = true
    } catch (e) {
      throw e
      // throw"fromFile decryptWallet catch" +
    }

    if (this.wallet !== null) {
      // errors.simpleError("fromFile decryptWallet this.wallet !== null")
      this.wallet.type = 'default'
      this._attachWallet(this.wallet)
    }
  };

  static generateWallet () {
    // eslint-disable-next-line new-cap
    const tempWallet = new EthereumWallet.generate()
    const privKey = tempWallet.getPrivateKeyString()

    return new BasicWallet_old({
      type: 'manualPrivateKey',
      manualPrivateKey: privKey
    })
  }

  static createWallet (priv, pub, path, hwType, hwTransport) {
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
    if (!this.wallet) throw Error('no wallet present. wallet not have been decrypted')
    if (typeof this.wallet.pubKey === 'undefined') {
      return ethUtil.privateToAddress(this.wallet.privKey)
    } else {
      return ethUtil.publicToAddress(this.wallet.pubKey, true)
    }
  }

  getAddressString () {
    let rawAddress = '0x' + this.getAddress().toString('hex')
    return ethUtil.toChecksumAddress(rawAddress)
  }

  fixPkey (key) {
    if (key.indexOf('0x') === 0) {
      return key.slice(2)
    }
    return key
  }

  getWalletFromPrivKeyFile (strjson, password) {
    let jsonArr
    if (typeof strjson === 'string') {
      jsonArr = JSON.parse(strjson)
    } else {
      jsonArr = strjson
    }
    if (jsonArr.encseed != null) return this.fromEthSale(strjson, password)
    else if (jsonArr.Crypto != null || jsonArr.crypto != null) return this.fromV3(strjson, password, true)
    else if (jsonArr.hash != null) return this.fromMyEtherWallet(strjson, password)
    else if (jsonArr.publisher === 'MyEtherWallet') return this.fromMyEtherWalletV2(strjson)
    else { throw Error('Error decoding wallet from file') }
  }

  fromMyEtherWalletKey (input, password) {
    let cipher = input.slice(0, 128)
    cipher = this.decodeCryptojsSalt(cipher)
    let evp = this.evp_kdf(Buffer.from(password), cipher.salt, {
      keysize: 32,
      ivsize: 16
    })
    let decipher = crypto.createDecipheriv('aes-256-cbc', evp.key, evp.iv)
    let privKey = this.decipherBuffer(decipher, Buffer.from(cipher.ciphertext))
    privKey = new this((privKey.toString()), 'hex')
    return Basic.createWallet(privKey)
  }

  fromV3 (input, passwordRaw, nonStrict) {
    try {
      assert(typeof passwordRaw === 'string')
    } catch (e) {
      throw Error(`password must be a string. received ${typeof passwordRaw}`)
    }

    let password = passwordRaw.toString()
    let seed // because let is block scoped
    try {
      let json
      if (typeof input === 'object') {
        let stringJson = JSON.stringify(input)
        json = JSON.parse(nonStrict ? stringJson.toLowerCase() : stringJson)
      } else {
        json = JSON.parse(nonStrict ? input.toLowerCase() : input)
      }
      // json = (typeof input === 'object') ? input : JSON.parse(nonStrict ? input.toLowerCase() : input)
      if (json.version !== 3) {
        throw new Error('Not a V3 wallet')
      }
      let derivedKey
      let kdfparams
      if (!json.crypto && json.Crypto) {
        json.crypto = json.Crypto
      }
      if (json.crypto.kdf === 'scrypt') {
        kdfparams = json.crypto.kdfparams
        derivedKey = scrypt(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
      } else if (json.crypto.kdf === 'pbkdf2') {
        kdfparams = json.crypto.kdfparams
        if (kdfparams.prf !== 'hmac-sha256') {
          throw new Error('Unsupported parameters to PBKDF2')
        }
        derivedKey = crypto.pbkdf2Sync(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256')
      } else {
        throw new Error('Unsupported key derivation scheme')
      }
      let ciphertext = Buffer.from(json.crypto.ciphertext, 'hex')
      let mac = ethUtil.sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
      if (mac.toString('hex') !== json.crypto.mac) {
        throw new Error('Key derivation failed - possibly wrong passphrase')
      }
      let decipher = crypto.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), Buffer.from(json.crypto.cipherparams.iv, 'hex'))
      seed = this.decipherBuffer(decipher, ciphertext, 'hex')
      while (seed.length < 32) {
        let nullBuff = Buffer.from([0x00])
        seed = Buffer.concat([nullBuff, seed])
      }
    } catch (e) {
      console.error(e)
    }
    return Basic.createWallet(seed)
  }

  fromMyEtherWallet (input, password) {
    let json = (typeof input === 'object') ? input : JSON.parse(input)
    let privKey
    if (!json.locked) {
      if (json.private.length !== 64) {
        throw new Error('Invalid private key length')
      }
      privKey = Buffer.from(json.private, 'hex')
    } else {
      if (typeof password !== 'string') {
        throw new Error('Password required')
      }
      if (password.length < 7) {
        throw new Error('Password must be at least 7 characters')
      }
      let cipher = json.encrypted ? json.private.slice(0, 128) : json.private
      cipher = this.decodeCryptojsSalt(cipher)
      let evp = this.evp_kdf(Buffer.from(password), cipher.salt, {
        keysize: 32,
        ivsize: 16
      })
      let decipher = ethUtil.crypto.createDecipheriv('aes-256-cbc', evp.key, evp.iv)
      privKey = this.decipherBuffer(decipher, Buffer.from(cipher.ciphertext))
      privKey = Buffer.from((privKey.toString()), 'hex')
    }
    let wallet = Basic.createWallet(privKey)
    if (wallet.getAddressString() !== json.address) {
      throw new Error('Invalid private key or address')
    }
    return wallet
  }

  fromMyEtherWalletV2 (input) {
    let json = (typeof input === 'object') ? input : JSON.parse(input)
    if (json.privKey.length !== 64) {
      throw new Error('Invalid private key length')
    }

    let privKey = Buffer.from(json.privKey, 'hex')
    return Basic.createWallet(privKey)
  }

  fromEthSale (input, password) {
    let json = (typeof input === 'object') ? input : JSON.parse(input)
    let encseed = Buffer.from(json.encseed, 'hex')
    let derivedKey = ethUtil.crypto.pbkdf2Sync(Buffer.from(password), Buffer.from(password), 2000, 32, 'sha256').slice(0, 16)
    let decipher = ethUtil.crypto.createDecipheriv('aes-128-cbc', derivedKey, encseed.slice(0, 16))
    let seed = this.decipherBuffer(decipher, encseed.slice(16))
    let wallet = Basic.createWallet(ethUtil.sha3(seed))
    if (wallet.getAddress().toString('hex') !== json.ethaddr) {
      throw new Error('Decoded key mismatch - possibly wrong passphrase')
    }
    return wallet
  }

  fromParityPhrase (phrase) {
    let hash = ethUtil.sha3(Buffer.from(phrase))
    for (let i = 0; i < 16384; i++) hash = ethUtil.sha3(hash)
    // eslint-disable-next-line eqeqeq
    while (ethUtil.privateToAddress(hash)[0] != 0) hash = ethUtil.sha3(hash)
    return Basic.createWallet(hash)
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
