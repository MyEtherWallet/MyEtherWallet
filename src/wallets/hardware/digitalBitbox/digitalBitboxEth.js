/**
 *  (c) 2017 Douglas Bakkum, Shift Devices AG
 *  MIT license
 **/

// Hijacks the U2F auth command to pass HWW API commands

// TODO - Integrate the smart verification mobile app (send result['echo'] from sign response).
//        Requires pairing, for example copy-pasting the pairing code from the desktop app (needs implementation).

'use strict';

import * as Crypto from 'crypto';
import * as HDKey from 'hdkey';

const DigitalBitboxEth = function(comm, sec) {
  this.comm = comm;
  DigitalBitboxEth.sec = sec || DigitalBitboxEth.sec;
  this.key = Crypto.createHash('sha256')
    .update(Buffer.from(DigitalBitboxEth.sec, 'utf8'))
    .digest();
  this.key = Crypto.createHash('sha256')
    .update(this.key)
    .digest();
  clearTimeout(DigitalBitboxEth.to);
  DigitalBitboxEth.to = setTimeout(function() {
    DigitalBitboxEth.sec = '';
  }, 60000);
};

DigitalBitboxEth.sec = '';
DigitalBitboxEth.to = null;

DigitalBitboxEth.aes_cbc_b64_decrypt = function(ciphertext, key) {
  let res;
  try {
    const ub64 = Buffer.from(ciphertext, 'base64').toString('binary');
    const iv = Buffer.from(ub64.slice(0, 16), 'binary');
    const enc = Buffer.from(ub64.slice(16), 'binary');
    const decipher = Crypto.createDecipheriv('aes-256-cbc', key, iv);
    const dec = decipher.update(enc) + decipher.final();
    res = dec.toString('utf8');
  } catch (err) {
    res = ciphertext;
  }
  return res;
};

DigitalBitboxEth.aes_cbc_b64_encrypt = function(plaintext, key) {
  try {
    const iv = Crypto.pseudoRandomBytes(16);
    const cipher = Crypto.createCipheriv('aes-256-cbc', key, iv);
    const ciphertext = Buffer.concat([
      iv,
      cipher.update(plaintext),
      cipher.final()
    ]);
    return ciphertext.toString('base64');
  } catch (err) {
    return '';
  }
};

DigitalBitboxEth.parseError = function(errObject) {
  const errMsg = {
    err101:
      'The Digital Bitbox is not initialized. First use the <a href="https://digitalbitbox.com/start" target="_blank" rel="noopener noreferrer">Digital Bitbox desktop app</a> to set up a wallet.', // No password set
    err250:
      'The Digital Bitbox is not initialized. First use the <a href="https://digitalbitbox.com/start" target="_blank" rel="noopener noreferrer">Digital Bitbox desktop app</a> to set up a wallet.', // Wallet not seeded
    err251:
      'The Digital Bitbox is not initialized. First use the <a href="https://digitalbitbox.com/start" target="_blank" rel="noopener noreferrer">Digital Bitbox desktop app</a> to set up a wallet.', // Wallet not seeded
    err109:
      'The Digital Bitbox received unexpected data. Was the correct password used? ' +
      errObject.message
  };
  const code = 'err' + errObject.code.toString();
  const msg = errMsg[code] || errObject.message;
  return msg;
};

DigitalBitboxEth.prototype.getAddress = function(path, callback) {
  const self = this;
  let cmd = '{"xpub":"' + path + '"}';
  cmd = DigitalBitboxEth.aes_cbc_b64_encrypt(cmd, this.key);
  const localCallback = function(response, error) {
    if (typeof error !== 'undefined') {
      callback(undefined, error);
    } else {
      try {
        response = JSON.parse(response.toString('utf8'));
        if ('error' in response) {
          callback(undefined, DigitalBitboxEth.parseError(response.error));
          return;
        }
        if ('ciphertext' in response) {
          response = JSON.parse(
            DigitalBitboxEth.aes_cbc_b64_decrypt(response.ciphertext, self.key)
          );
          if ('error' in response) {
            callback(undefined, DigitalBitboxEth.parseError(response.error));
            return;
          }
          const hdkey = HDKey.fromExtendedKey(response.xpub);
          const result = {
            publicKey: hdkey.publicKey.toString('hex'),
            chainCode: hdkey.chainCode.toString('hex')
          };
          callback(result);
          return;
        }
      } catch (err) {
        callback(undefined, 'Unexpected error: ' + err.message);
      }
    }
  };
  self.comm.exchange(cmd, localCallback);
};

DigitalBitboxEth.signGeneric = function(
  self,
  path,
  chainId,
  hashToSign,
  callback
) {
  let cmd =
    '{"sign":{"data":[{"hash":"' +
    hashToSign +
    '","keypath":"' +
    path +
    '"}]}}';
  cmd = DigitalBitboxEth.aes_cbc_b64_encrypt(cmd, self.key);

  const localCallback = function(response, error) {
    if (typeof error !== 'undefined') {
      callback(undefined, error);
    } else {
      try {
        response = JSON.parse(response.toString('utf8'));
        if ('error' in response) {
          callback(undefined, DigitalBitboxEth.parseError(response.error));
          return;
        }
        if ('ciphertext' in response) {
          response = JSON.parse(
            DigitalBitboxEth.aes_cbc_b64_decrypt(response.ciphertext, self.key)
          );
          if ('error' in response) {
            callback(undefined, DigitalBitboxEth.parseError(response.error));
            return;
          }
          if ('echo' in response) {
            // Echo from first sign command. (Smart verification not implemented.)
            // Send second sign command.
            let cmd = '{"sign":""}';
            cmd = DigitalBitboxEth.aes_cbc_b64_encrypt(cmd, self.key);
            self.comm.exchange(cmd, localCallback);
            return;
          }
          if ('sign' in response) {
            const vOffset = chainId ? chainId * 2 + 8 : 0;
            const v = Buffer.from([
              parseInt(response.sign[0].recid, 16) + 27 + vOffset
            ]);
            const result = {
              v: v.toString('hex'),
              r: response.sign[0].sig.slice(0, 64),
              s: response.sign[0].sig.slice(64, 128)
            };
            callback(result);
            return;
          }
        }
      } catch (err) {
        callback(undefined, 'Unexpected error:' + err.message);
      }
    }
  };
  self.comm.exchange(cmd, localCallback);
};

DigitalBitboxEth.prototype.signTransaction = function(path, eTx, callback) {
  const self = this;
  const hashToSign = eTx.hash(false).toString('hex');
  DigitalBitboxEth.signGeneric(self, path, eTx._chainId, hashToSign, callback);
};

DigitalBitboxEth.prototype.signMessage = function(path, messageHex, callback) {
  const self = this;
  const hashToSign = messageHex.toString('hex');
  DigitalBitboxEth.signGeneric(self, path, 0, hashToSign, callback);
};

export { DigitalBitboxEth };
