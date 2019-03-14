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
const BitBoxSupportedMajorVersion = 6;
class DigitalBitboxEth {
  static aes_cbc_b64_decrypt = (ciphertext, key) => {
    try {
      const h = Crypto.createHash('sha512')
        .update(key)
        .digest();
      const encryptionKey = h.slice(0, 32);
      const authenticationKey = h.slice(32, 64);

      const ub64 = new Buffer(ciphertext, 'base64').toString('binary');
      const cipher = new Buffer(ub64.slice(0, ub64.length - 32), 'binary');
      const hmac = new Buffer(ub64.slice(ub64.length - 32), 'binary');
      const expectedHmac = Crypto.createHmac('sha256', authenticationKey)
        .update(cipher)
        .digest();
      if (!hmac.equals(expectedHmac)) {
        throw 'hmac check failed';
      }
      const iv = new Buffer(cipher.slice(0, 16), 'binary');
      const enc = new Buffer(cipher.slice(16), 'binary');
      const decipher = Crypto.createDecipheriv(
        'aes-256-cbc',
        encryptionKey,
        iv
      );
      const dec = decipher.update(enc) + decipher.final();
      return dec.toString('utf8');
    } catch (err) {
      return ciphertext;
    }
  };
  static aes_cbc_b64_encrypt = (plaintext, key) => {
    try {
      const h = Crypto.createHash('sha512')
        .update(key)
        .digest();
      const encryptionKey = h.slice(0, 32);
      const authenticationKey = h.slice(32, 64);

      const iv = Crypto.randomBytes(16);
      const cipher = Crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
      const ciphertext = Buffer.concat([
        iv,
        cipher.update(plaintext),
        cipher.final()
      ]);
      const hmac = Crypto.createHmac('sha256', authenticationKey)
        .update(ciphertext)
        .digest();
      return Buffer.concat([ciphertext, hmac]).toString('base64');
    } catch (err) {
      return '';
    }
  };
  static parseError = errObject => {
    const errMsg = {
      err101:
        'The BitBox is not initialized. First use the <a href="https://shiftcrypto.ch/start" target="_blank" rel="noopener noreferrer">Digital Bitbox desktop app</a> to set up a wallet.', // No password set
      err250:
        'The BitBox is not initialized. First use the <a href="https://shiftcrypto.ch/start" target="_blank" rel="noopener noreferrer">BitBox desktop app</a> to set up a wallet.', // Wallet not seeded
      err251:
        'The BitBox is not initialized. First use the <a href="https://shiftcrypto.ch/start" target="_blank" rel="noopener noreferrer">BitBox desktop app</a> to set up a wallet.', // Wallet not seeded
      err109:
        'The BitBox received unexpected data. Was the correct password used? ' +
        errObject.message
    };
    const code = 'err' + errObject.code.toString();
    const msg = errMsg[code] || errObject.message;
    return msg;
  };
  static signGeneric = (self, path, chainId, hashToSign, callback) => {
    const cmd =
      '{"sign":{"data":[{"hash":"' +
      hashToSign +
      '","keypath":"' +
      path +
      '"}]}}';
    const localCallback = (response, error) => {
      if (typeof error != 'undefined') {
        callback(undefined, error);
        return;
      }
      if ('echo' in response) {
        const cmd = '{"sign":""}';
        self.send(cmd, localCallback);
        return;
      }
      if ('sign' in response) {
        const vOffset = chainId ? chainId * 2 + 8 : 0;
        const v = new Buffer([
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
    };
    self.send(cmd, localCallback);
  };
  constructor(comm, sec) {
    this.comm = comm;
    this.sec = '';
    this.to = null;
    this.sec = sec || this.sec;
    this.key = Crypto.createHash('sha256')
      .update(new Buffer(this.sec, 'utf8'))
      .digest();
    this.key = Crypto.createHash('sha256')
      .update(this.key)
      .digest();
    clearTimeout(this.to);
    this.to = setTimeout(() => {
      this.sec = '';
    }, 60000);
  }
  send(cmd, callback) {
    this.comm.exchange('{"ping":""}', (pingResponse, pingError) => {
      if (typeof pingError !== 'undefined') {
        callback(undefined, pingError);
        return;
      }
      pingResponse = JSON.parse(pingResponse.toString('utf8'));
      if (!('device' in pingResponse)) {
        callback(
          undefined,
          'Please upgrade to the newest firmware using the <a href="https://shiftcrypto.ch/start" target="_blank" rel="noopener noreferrer">BitBox Desktop app.</a>'
        );
        return;
      }
      const match = /^v(\d+)\.\d+\.\d+/.exec(pingResponse.device.version);
      if (match === null || match.length != 2) {
        throw 'unexpected reply';
      }
      const majorVersion = parseInt(match[1]);
      if (majorVersion < BitBoxSupportedMajorVersion) {
        callback(
          undefined,
          'Please upgrade to the newest firmware using the <a href="https://shiftcrypto.ch/start" target="_blank" rel="noopener noreferrer">BitBox Desktop app.</a>'
        );
        return;
      }
      if (majorVersion > BitBoxSupportedMajorVersion) {
        callback(
          undefined,
          'MyEtherWallet does not yet support this version of the firmware'
        );
        return;
      }
      const cipher = DigitalBitboxEth.aes_cbc_b64_encrypt(cmd, this.key);
      this.comm.exchange(cipher, response => {
        if (typeof pingError !== 'undefined') {
          callback(undefined, pingError);
          return;
        }
        try {
          response = JSON.parse(response.toString('utf8'));
          if ('error' in response) {
            callback(undefined, DigitalBitboxEth.parseError(response.error));
            return;
          }
          if ('ciphertext' in response) {
            response = JSON.parse(
              DigitalBitboxEth.aes_cbc_b64_decrypt(
                response.ciphertext,
                this.key
              )
            );
            if ('error' in response) {
              callback(undefined, DigitalBitboxEth.parseError(response.error));
              return;
            }
            callback(response, undefined);
          }
        } catch (err) {
          callback(undefined, 'Unexpected error: ' + err.message);
        }
      });
    });
  }
  getAddress(path, callback) {
    const cmd = '{"xpub":"' + path + '"}';
    const localCallback = (response, error) => {
      if (typeof error != 'undefined') {
        callback(undefined, error);
        return;
      }
      const hdkey = HDKey.fromExtendedKey(response.xpub);
      const result = {
        publicKey: hdkey.publicKey.toString('hex'),
        chainCode: hdkey.chainCode.toString('hex')
      };
      callback(result);
      return;
    };
    this.send(cmd, localCallback);
  }
  signTransaction(path, eTx) {
    return new Promise((resolve, reject) => {
      const hashToSign = eTx.hash(false).toString('hex');
      DigitalBitboxEth.signGeneric(
        this,
        path,
        eTx._chainId,
        hashToSign,
        (result, error) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  }
  signMessage(path, messageHex) {
    return new Promise((resolve, reject) => {
      const hashToSign = messageHex.toString('hex');
      DigitalBitboxEth.signGeneric(
        this,
        path,
        0,
        hashToSign,
        (result, error) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  }
}
export default DigitalBitboxEth;
