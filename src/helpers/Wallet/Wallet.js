import crypto from 'crypto'
import util from 'ethereumjs-util'
import web3 from 'web3'
import scryptsy from 'scryptsy'
import uuid from 'uuid'

const Wallet = function (priv, pub, path, hwType, hwTransport) {
  if (typeof priv !== 'undefined') {
    this.privKey = priv.length === 32 ? priv : Buffer.from(priv, 'hex')
  }
  this.pubKey = pub
  this.path = path
  this.hwType = hwType
  this.hwTransport = hwTransport
  this.type = 'default'
}

Wallet.toJSON = function () {
  return {
    address: this.getAddressString(),
    checksumAddress: this.getChecksumAddressString(),
    privKey: this.getPrivateKeyString(),
    pubKey: this.getPublicKeyString(),
    publisher: 'MyEtherWallet',
    encrypted: false,
    version: 2
  }
}

Wallet.generate = function (icapDirect) {
  if (icapDirect) {
    while (true) {
      const privKey = crypto.randomBytes(32)
      if (util.privateToAddress(privKey)[0] === 0) {
        return new Wallet(privKey)
      }
    }
  } else {
    return new Wallet(crypto.randomBytes(32))
  }
}

Wallet.prototype.getAddress = function () {
  if (typeof this.pubKey === 'undefined') {
    return util.privateToAddress(this.privKey)
  } else {
    return util.publicToAddress(this.pubKey, true)
  }
}

Wallet.prototype.getAddressString = function () {
  return '0x' + this.getAddress().toString('hex')
}

Wallet.prototype.getChecksumAddressString = function () {
  return web3.utils.toChecksumAddress(this.getAddressString())
}

Wallet.fromPrivateKey = function (priv) {
  return new Wallet(priv)
}

Wallet.prototype.createJson = function (password, options) {
  const opts = options || {}
  const salt = opts.salt || crypto.randomBytes(32)
  const iv = opts.iv || crypto.randomBytes(16)
  const kdf = opts.kdf || 'scrypt'
  const kdfParams = {
    dklen: opts.dklen || 32,
    salt: salt.toString('hex')
  }
  let derivedKey

  if (kdf === 'pbkdf2') {
    kdfParams.c = options.c || 262144
    kdfParams.prf = 'hmac-sha256'
    derivedKey = crypto.pbkdf2Sync(
      Buffer.from(password),
      salt,
      kdfParams.c,
      kdfParams.dklen,
      'sha256'
    )
  } else if (kdf === 'scrypt') {
    // FIXME: support progress reporting callback
    kdfParams.n = opts.n || 262144
    kdfParams.r = opts.r || 8
    kdfParams.p = opts.p || 1
    derivedKey = scryptsy(
      Buffer.from(password),
      salt,
      kdfParams.n,
      kdfParams.r,
      kdfParams.p,
      kdfParams.dklen
    )
  } else {
    throw new Error('Unsupported kdf')
  }
  const cipher = crypto.createCipheriv(
    opts.cipher || 'aes-128-ctr',
    derivedKey.slice(0, 16),
    iv
  )
  if (!cipher) {
    throw new Error('Unsupported cipher')
  }

  const cipherText = Buffer.concat([
    cipher.update(this.privKey),
    cipher.final()
  ])
  const mac = web3.sha3(
    Buffer.concat([derivedKey.slice(16, 32), Buffer.from(cipherText, 'hex')])
  )

  return {
    version: 5,
    id: uuid.v4({
      random: opts.uuid || crypto.randomBytes(16)
    }),
    address: this.getAddress().toString('hex'),
    crypto: {
      ciphertext: cipherText.toString('hex'),
      cipherparams: {
        iv: iv.toString('hex')
      },
      cipher: opts.cipher || 'aes-128-ctr',
      kdf: kdf,
      kdfparams: kdfParams,
      mac: mac.toString('hex')
    }
  }
}

export default Wallet
