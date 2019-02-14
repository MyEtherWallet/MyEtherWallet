import web3 from 'web3';
import { Toast } from '@/helpers';
const secp256k1 = require('secp256k1');
const assert = require('assert');
const createKeccakHash = require('keccak');

function toBuffer(v) {
  const BN = web3.utils.BN;
  if (!Buffer.isBuffer(v)) {
    if (Array.isArray(v)) {
      v = Buffer.from(v);
    } else if (typeof v === 'string') {
      if (isHexString(v)) {
        v = Buffer.from(padToEven(stripHexPrefix(v)), 'hex');
      } else {
        v = Buffer.from(v);
      }
    } else if (typeof v === 'number') {
      v = exports.intToBuffer(v);
    } else if (v === null || v === undefined) {
      v = Buffer.allocUnsafe(0);
    } else if (BN.isBN(v)) {
      v = v.toArrayLike(Buffer);
    } else if (v.toArray) {
      // converts a BN to a Buffer
      v = Buffer.from(v.toArray());
    } else {
      const err = new Error('invalid type');
      Toast.responseHandler(err, false);
    }
  }
  return v;
}

function padToEven(a) {
  if (a.length % 2) a = '0' + a;
  return a;
}

function isHexPrefixed(str) {
  return str.slice(0, 2) === '0x';
}

function stripHexPrefix(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return isHexPrefixed(str) ? str.slice(2) : str;
}

function isHexString(value, length) {
  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }

  if (length && value.length !== 2 + 2 * length) {
    return false;
  }

  return true;
}

function zeros(bytes) {
  return Buffer.allocUnsafe(bytes).fill(0);
}

function setLength(msg, length, right) {
  const buf = zeros(length);
  msg = toBuffer(msg);
  if (right) {
    if (msg.length < length) {
      msg.copy(buf);
      return buf;
    }
    return msg.slice(0, length);
  }
  if (msg.length < length) {
    msg.copy(buf, length - msg.length);
    return buf;
  }
  return msg.slice(-length);
}

function getNakedAddress(address) {
  return address.toLowerCase().replace('0x', '');
}

function sha3(a, bits) {
  a = toBuffer(a);
  if (!bits) bits = 256;
  return createKeccakHash('keccak' + bits)
    .update(a)
    .digest();
}

function hashPersonalMessage(message) {
  const prefix = toBuffer(
    '\x19Ethereum Signed Message:\n' + message.length.toString()
  );
  return sha3(Buffer.concat([prefix, message]));
}

function ecrecover(hash, v, r, s) {
  const signature = Buffer.concat([setLength(r, 32), setLength(s, 32)], 64);
  const recovery = v - 27;
  if (recovery !== 0 && recovery !== 1) {
    const e = new Error('Invalid signature v value');
    Toast.responseHandler(e, false);
  }
  const senderPubKey = secp256k1.recover(hash, signature, recovery);
  return secp256k1.publicKeyConvert(senderPubKey, false).slice(1);
}

function pubToAddress(pubKey, sanitize) {
  pubKey = toBuffer(pubKey);
  if (sanitize && pubKey.length !== 64) {
    pubKey = secp256k1.publicKeyConvert(pubKey, false).slice(1);
  }
  assert(pubKey.length === 64);
  return sha3(pubKey).slice(-20);
}

function getTrezorLenBuf(msgLen) {
  if (msgLen < 253) return Buffer.from([msgLen & 0xff]);
  else if (msgLen < 0x10000) {
    return Buffer.from([253, msgLen & 0xff, (msgLen >> 8) & 0xff]);
  }
  return Buffer.from([
    254,
    msgLen & 0xff,
    (msgLen >> 8) & 0xff,
    (msgLen >> 16) & 0xff,
    (msgLen >> 24) & 0xff
  ]);
}
function getTrezorHash(msg) {
  return sha3(
    Buffer.concat([
      toBuffer('\u0019Ethereum Signed Message:\n'),
      getTrezorLenBuf(msg.length),
      toBuffer(msg)
    ])
  );
}

const MessageUtil = {
  toBuffer: toBuffer,
  padToEven: padToEven,
  isHexPrefixed: isHexPrefixed,
  stripHexPrefix: stripHexPrefix,
  isHexString: isHexString,
  setLength: setLength,
  hashPersonalMessage: hashPersonalMessage,
  ecrecover: ecrecover,
  zeros: zeros,
  getNakedAddress: getNakedAddress,
  pubToAddress: pubToAddress,
  getTrezorHash: getTrezorHash
};

export default MessageUtil;
