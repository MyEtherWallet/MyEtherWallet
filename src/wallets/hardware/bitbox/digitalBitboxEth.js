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
import * as semver from 'semver';

const BitBoxSupportedVersion = '7.0.1';
const hijackState = {
  // Order must match that in the firmware code
  responseReady: 0,
  processingCommand: 1,
  incompleteCommand: 2,
  idle: 3
};
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
      err101: 'errorNotInitialized', // No password set
      err250: 'errorNotInitialized', // Wallet not seeded
      err251: 'errorNotInitialized', // Wallet not seeded
      err109: 'errorInvalidPassword' + errObject.message, // Wrong password (typically); append error message in order to parse login tries left
      err600: 'errorUserAbort', // User aborted action
      err601: 'errorUserTimeout' // Touch button not pressed
    };
    const code = 'err' + ('code' in errObject ? errObject.code.toString() : '');
    const err = { message: errMsg[code] || 'errorUnexpected' };
    return err;
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
        self.send('{"sign":""}', true, localCallback);
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
    self.send(cmd, true, localCallback);
  };
  constructor(comm, secret) {
    this.comm = comm;
    this.secret = '';
    this.timeout = null;
    this.secret = secret || this.secret;
    this.key = Crypto.createHash('sha256')
      .update(new Buffer(this.secret, 'utf8'))
      .digest();
    this.key = Crypto.createHash('sha256')
      .update(this.key)
      .digest();
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.secret = '';
    }, 60000);
  }
  send(cmd, encrypt, callback) {
    let message = '';
    if (encrypt) message = DigitalBitboxEth.aes_cbc_b64_encrypt(cmd, this.key);
    else message = cmd || ' '; // Need at least 1 byte length for U2F
    this.comm.exchange(message, (response, err) => {
      try {
        if (typeof err !== 'undefined' || typeof response === 'undefined') {
          // Entered on U2F timeouts
          // Poll for the response
          this.send('', false, callback);
          return;
        }
        if (response.length == 1) {
          if (response[0] == hijackState.processingCommand) {
            // BitBox is processing the previous command
            // Poll for the response
            this.send('', false, callback);
          }
          return;
        }
        response = JSON.parse(response.toString('utf8'));
        if ('error' in response) {
          callback(undefined, DigitalBitboxEth.parseError(response.error));
          return;
        }

        if ('ping' in response) {
          if (!('device' in response)) {
            callback(undefined, 'errorUpgradeFirmware');
            return;
          }
          if (semver.lt(response.device.version, BitBoxSupportedVersion)) {
            callback(undefined, 'errorUpgradeFirmware');
            return;
          }
          if (semver.gt(response.device.version, BitBoxSupportedVersion)) {
            callback(undefined, 'errorUnsupportedFirmware');
            return;
          }
          callback(response);
        }

        if ('ciphertext' in response) {
          response = JSON.parse(
            DigitalBitboxEth.aes_cbc_b64_decrypt(response.ciphertext, this.key)
          );
          if ('error' in response) {
            callback(undefined, DigitalBitboxEth.parseError(response.error));
            return;
          }
          callback(response);
        }
      } catch (err) {
        // unexpected error
        callback(undefined, 'errorUnexpected');
      }
    });
  }
  getStarted(path, callback) {
    // First check firmware version compatibility
    // Get extended public key if firmware is compatible
    // Else return an error
    const localCallback = (response, error) => {
      if (typeof error != 'undefined') {
        callback(undefined, error);
        return;
      }
      this.getAddress(path, callback);
    };
    this.send('{"ping":""}', false, localCallback);
  }
  getAddress(path, callback) {
    // Get extended public key
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
    this.send(cmd, true, localCallback);
  }
  signTransaction(path, eTx) {
    return new Promise((resolve, reject) => {
      const chainId = eTx.getChainId();
      const hashToSign = eTx.hash(false).toString('hex');
      DigitalBitboxEth.signGeneric(
        this,
        path,
        chainId,
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
