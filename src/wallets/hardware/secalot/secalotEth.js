'use strict';

const SecalotEth = function(comm, pinCode) {
  this.comm = comm;
  if (typeof pinCode !== 'undefined') this.pinCode = pinCode;
};

SecalotEth.splitPath = function(path) {
  const result = [];
  const components = path.split('/');

  components.forEach(element => {
    let number = parseInt(element, 10);
    if (isNaN(number)) {
      return;
    }
    if (element.length > 1 && element[element.length - 1] === "'") {
      number += 0x80000000;
    }
    result.push(number);
  });
  return result;
};

SecalotEth.getErrorMessage = function(sw, operation) {
  let errorMessage;
  if (sw === 0x6d00) {
    errorMessage = 'Ethereum wallet on your Secalot is not initialized.';
  } else if (sw === 0x6982) {
    if (operation === 'getPublicKey') {
      errorMessage =
        'Invalid PIN-code. Be careful, after entering a wrong PIN-code three times in a row, your Secalot Ethereum wallet would be permanently wiped.';
    } else {
      errorMessage = 'PIN-code not verified.';
    }
  } else if (sw === 0x6700) {
    errorMessage = 'Invalid PIN-code length.';
  } else if (sw === 0x6985) {
    errorMessage = 'Operation timed out.';
  } else {
    errorMessage = 'An error has occurred. SW = ' + sw.toString(16) + '.';
  }

  return errorMessage;
};

SecalotEth.prototype.getAddress = function(path, callback) {
  const splitPath = SecalotEth.splitPath(path);
  const apdus = [];
  let buffer;
  const self = this;
  const localCallback = function(response, error) {
    if (typeof error !== 'undefined') {
      callback(undefined, error);
    } else {
      const result = {};
      response = Buffer.from(response, 'hex');
      const sw = response.readUInt16BE(response.length - 2);
      if (sw !== 0x9000) {
        callback(undefined, SecalotEth.getErrorMessage(sw, 'getPublicKey'));
        return;
      }
      if (apdus.length === 0) {
        result['publicKey'] = response.slice(0, 65).toString('hex');
        result['chainCode'] = response.slice(65, 97).toString('hex');
        callback(result);
      } else {
        self.comm.exchange(apdus.shift(), localCallback);
      }
    }
  };

  buffer = Buffer.alloc(4);
  buffer[0] = 0x80;
  buffer[1] = 0xc4;
  buffer[2] = 0x00;
  buffer[3] = 0x00;

  apdus.push(buffer.toString('hex'));

  if (typeof this.pinCode !== 'undefined') {
    const pin = Buffer.from(this.pinCode, 'utf8');
    buffer = Buffer.alloc(5 + pin.length);
    buffer[0] = 0x80;
    buffer[1] = 0x22;
    buffer[2] = 0x00;
    buffer[3] = 0x00;
    buffer[4] = pin.length;

    pin.copy(buffer, 5, 0, pin.length);
    apdus.push(buffer.toString('hex'));
  }

  buffer = Buffer.alloc(5 + 1 + splitPath.length * 4);
  buffer[0] = 0x80;
  buffer[1] = 0x40;
  buffer[2] = 0x00;
  buffer[3] = 0x00;
  buffer[4] = 1 + splitPath.length * 4;
  buffer[5] = splitPath.length;
  splitPath.forEach((element, idx) => {
    buffer.writeUInt32BE(element, 6 + 4 * idx);
  });

  apdus.push(buffer.toString('hex'));
  self.comm.exchange(apdus.shift(), localCallback);
};
SecalotEth.prototype.signTransactionAsync = function(path, eTx) {
  return new Promise((resolve, reject) => {
    this.signTransaction(path, eTx, (result, error) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
SecalotEth.prototype.signTransaction = function(path, eTx, callback) {
  const splitPath = SecalotEth.splitPath(path);
  let offset = 0;
  let rawData = '';
  const apdus = [];
  const self = this;
  const localCallback = function(response, error) {
    if (typeof error !== 'undefined') {
      callback(undefined, error);
    } else {
      response = Buffer.from(response, 'hex');
      const sw = response.readUInt16BE(response.length - 2);

      if (sw !== 0x9000) {
        callback(undefined, SecalotEth.getErrorMessage(sw, 'signTransaction'));
        return;
      }

      if (apdus.length === 0) {
        const result = {};
        let v = response[0] + 27;

        if (eTx._chainId > 0) {
          v += eTx._chainId * 2 + 8;
        }

        result['v'] = Buffer.from([v]).toString('hex');
        result['r'] = response.slice(1, 1 + 32).toString('hex');
        result['s'] = response.slice(1 + 32, 1 + 32 + 32).toString('hex');
        callback(result);
      } else {
        self.comm.exchange(apdus.shift(), localCallback);
      }
    }
  };

  const savedRaw = eTx.raw.slice();
  eTx.v = eTx._chainId;
  eTx.r = 0;
  eTx.s = 0;
  const dataToHash = eTx.serialize();
  eTx.raw = savedRaw;

  rawData = Buffer.from(dataToHash, 'hex');

  while (offset !== rawData.length) {
    const maxChunkSize = 64;
    const chunkSize =
      offset + maxChunkSize > rawData.length
        ? rawData.length - offset
        : maxChunkSize;
    const buffer = Buffer.alloc(5 + chunkSize);

    buffer[0] = 0x80;
    buffer[1] = 0xf2;
    buffer[2] = offset === 0 ? 0x00 : 0x01;
    buffer[3] = 0x00;
    buffer[4] = chunkSize;

    rawData.copy(buffer, 5, offset, offset + chunkSize);
    apdus.push(buffer.toString('hex'));
    offset += chunkSize;
  }

  const buffer = Buffer.alloc(5 + 1 + splitPath.length * 4);

  buffer[0] = 0x80;
  buffer[1] = 0xf2;
  buffer[2] = 0x02;
  buffer[3] = 0x00;
  buffer[4] = 1 + splitPath.length * 4;
  buffer[5] = splitPath.length;

  splitPath.forEach((element, index) => {
    buffer.writeUInt32BE(element, 6 + 4 * index);
  });

  apdus.push(buffer.toString('hex'));
  self.comm.exchange(apdus.shift(), localCallback);
};
SecalotEth.prototype.signMessageAsync = function(path, message) {
  return new Promise((resolve, reject) => {
    this.signMessage(path, message, (result, error) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};
SecalotEth.prototype.signMessage = function(path, message, callback) {
  const splitPath = SecalotEth.splitPath(path);
  let offset = 0;
  let rawData = '';
  const apdus = [];
  const self = this;
  const localCallback = function(response, error) {
    if (typeof error !== 'undefined') {
      callback(undefined, error);
    } else {
      response = Buffer.from(response, 'hex');
      const sw = response.readUInt16BE(response.length - 2);
      if (sw !== 0x9000) {
        callback(undefined, SecalotEth.getErrorMessage(sw, 'signMessage'));
        return;
      }
      if (apdus.length === 0) {
        const obj = {};
        const v = response[0] + 27;
        obj['v'] = Buffer.from([v]).toString('hex');
        obj['r'] = response.slice(1, 1 + 32).toString('hex');
        obj['s'] = response.slice(1 + 32, 1 + 32 + 32).toString('hex');
        const result = obj['r'] + obj['s'] + obj['v'];

        callback('0x' + result.toString('hex'));
      } else {
        self.comm.exchange(apdus.shift(), localCallback);
      }
    }
  };

  message =
    '\x19Ethereum Signed Message:\n' + message.length.toString() + message;
  rawData = Buffer.from(Buffer.from(message).toString('hex'), 'hex');

  while (offset !== rawData.length) {
    const maxChunkSize = 64;
    const chunkSize =
      offset + maxChunkSize > rawData.length
        ? rawData.length - offset
        : maxChunkSize;
    const buffer = Buffer.alloc(5 + chunkSize);
    buffer[0] = 0x80;
    buffer[1] = 0xf2;
    buffer[2] = offset === 0 ? 0x00 : 0x01;
    buffer[3] = offset === 0 ? 0x01 : 0x00;
    buffer[4] = chunkSize;

    rawData.copy(buffer, 5, offset, offset + chunkSize);

    apdus.push(buffer.toString('hex'));
    offset += chunkSize;
  }

  const buffer = Buffer.alloc(5 + 1 + splitPath.length * 4);
  buffer[0] = 0x80;
  buffer[1] = 0xf2;
  buffer[2] = 0x02;
  buffer[3] = 0x00;
  buffer[4] = 1 + splitPath.length * 4;
  buffer[5] = splitPath.length;

  splitPath.forEach((element, idx) => {
    buffer.writeUInt32BE(element, 6 + 4 * idx);
  });

  apdus.push(buffer.toString('hex'));
  self.comm.exchange(apdus.shift(), localCallback);
};

export default SecalotEth;
