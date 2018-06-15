import crypto from 'crypto'
import util from 'ethereumjs-util'

import scryptsy from 'scryptsy'
import uuid from 'uuid'
import * as Hash from 'eth-lib/lib/hash'

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
  return toChecksumAddress(this.getAddressString())
}

Wallet.fromPrivateKey = function (priv) {
  return new Wallet(priv)
}

Wallet.prototype.getV3FileName = function (timestamp) {
  var ts = timestamp ? new Date(timestamp) : new Date()
  return ['UTC--', ts.toJSON().replace(/:/g, '-'), '--', this.getAddress().toString('hex')].join('')
}

Wallet.createBlob = function (mime, str) {
  const string = (typeof str === 'object') ? JSON.stringify(str) : str
  if (string === null) return ''
  var blob = new Blob([string], {
    type: mime
  })
  // if (typeof window === 'undefined') throw new Error('Window is undefined. File creation failed')
  return URL.createObjectURL(blob)
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
  const mac = sha3(
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

var hexToBytes = function (hex) {
  hex = hex.toString(16)

  if (!isHexStrict(hex)) {
    throw new Error('Given value "' + hex + '" is not a valid hex string.')
  }

  hex = hex.replace(/^0x/i, '')

  for (var bytes = [], c = 0; c < hex.length; c += 2) { bytes.push(parseInt(hex.substr(c, 2), 16)) }
  return bytes
}

var isHexStrict = function (hex) {
  return ((isString(hex) || isNumber(hex)) && /^(-)?0x[0-9a-f]*$/i.test(hex))
}

var SHA3_NULL_S = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'

function sha3 (value) {
  if (isHexStrict(value) && /^0x/i.test((value).toString())) {
    value = hexToBytes(value)
  }

  var returnValue = Hash.keccak256(value) // jshint ignore:line

  if (returnValue === SHA3_NULL_S) {
    return null
  } else {
    return returnValue
  }
};

function toChecksumAddress (address) {
  if (typeof address === 'undefined') return ''

  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) { throw new Error('Given address "' + address + '" is not a valid Ethereum address.') }

  address = address.toLowerCase().replace(/^0x/i, '')
  var addressHash = sha3(address).replace(/^0x/i, '')
  var checksumAddress = '0x'

  for (var i = 0; i < address.length; i++) {
    // If ith character is 9 to f then make it uppercase
    if (parseInt(addressHash[i], 16) > 7) {
      checksumAddress += address[i].toUpperCase()
    } else {
      checksumAddress += address[i]
    }
  }
  return checksumAddress
};

// lodash utils
let undefinedTag = '[object Undefined]'
let symToStringTag = Symbol ? Symbol.toStringTag : undefined
let nullTag = '[object Null]'
let proxyTag = '[object Proxy]'
let genTag = '[object GeneratorFunction]'
let asyncTag = '[object AsyncFunction]'
let funcTag = '[object Function]'
let stringTag = '[object String]'
let numberTag = '[object Number]'

let objectProto = Object.prototype
var hasOwnProperty = objectProto.hasOwnProperty
var nativeObjectToString = objectProto.toString

// eslint-disable-next-line no-unused-vars
function isFunction (value) {
  if (!isObject(value)) {
    return false
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value)
  return tag === funcTag || tag === genTag || tag === asyncTag || tag === proxyTag
}

function isNumber (value) {
  return typeof value === 'number' ||
    (isObjectLike(value) && baseGetTag(value) === numberTag)
}

function isObject (value) {
  var type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

function baseGetTag (value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value)
}

function objectToString (value) {
  return nativeObjectToString.call(value)
}

function isObjectLike (value) {
  return value != null && typeof value === 'object'
}
function isArray (value) {
  return Array.isArray(value)
}

// eslint-disable-next-line no-unused-vars
function isString (value) {
  return typeof value === 'string' ||
    (!isArray(value) && isObjectLike(value) && baseGetTag(value) === stringTag)
}

// eslint-disable-next-line no-unused-vars
function isNull (value) {
  return value === null
}

function getRawTag (value) {
// eslint-disable-next-line one-var
  var isOwn = hasOwnProperty.call(value, symToStringTag),
    tag = value[symToStringTag]

  try {
    value[symToStringTag] = undefined
    var unmasked = true
  } catch (e) {
  }

  var result = nativeObjectToString.call(value)
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag
    } else {
      delete value[symToStringTag]
    }
  }
  return result
}

export default Wallet
