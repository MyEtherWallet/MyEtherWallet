// eslint-disable
/**
 *  (c) 2017 Douglas Bakkum, Shift Devices AG
 *  MIT license
 **/

'use strict';

const DigitalBitboxUsb = function () {};

let _callback = null;
let _hidDevice = null;
let _readBuffer = null;
let _dataLen = null;

async function connectWebHID() {
  if (_hidDevice !== null) {
    return;
  }
  const vendorID = 0x03eb;
  const productID = 0x2402;
  _hidDevice = (
    await navigator.hid.requestDevice({ filters: [{ vendorID, productID }] })
  )[0];
  await _hidDevice.open();
  _hidDevice.addEventListener('inputreport', event => {
    if (!_callback) {
      return;
    }
    const data = Buffer.from(event.data.buffer);
    if (_readBuffer === null) {
      if (data.length < 7) {
        throw 'unexpected response';
      }
      _dataLen = data[5] * 256 + data[6];
      _readBuffer = data.slice(7);
    } else {
      if (data.length < 5) {
        throw 'unexpected response';
      }
      _readBuffer = Buffer.concat([_readBuffer, data.slice(5)]);
    }
    if (_readBuffer.length >= _dataLen) {
      const x = _readBuffer.slice(0, _dataLen);
      const cb = _callback;
      _callback = null;
      _readBuffer = null;
      _dataLen = null;
      cb(x);
    }
  });
}

const cid = 0xff000000;
const cmd = 0x80 + 0x40 + 0x01;
DigitalBitboxUsb.prototype.exchange = function (msg, callback) {
  _callback = callback;
  msg = Buffer.from(msg, 'ascii');
  connectWebHID().then(() => {
    const kh_max_len = 64;
    let index = 0;
    while (msg.length > 0) {
      const tmp = Buffer.alloc(4);
      tmp.writeUInt32BE(cid);
      let header = null;
      if (index === 0) {
        const tmp2 = Buffer.alloc(2);
        tmp2.writeUInt16BE(msg.length & 0xffff);
        header = Buffer.concat([tmp, Buffer.from([cmd]), tmp2]);
      } else {
        const seq = index - 1;
        header = Buffer.concat([tmp, Buffer.from([seq])]);
      }
      const chunk = msg.slice(0, kh_max_len - header.length);
      msg = msg.slice(kh_max_len - header.length);
      let kh = Buffer.concat([header, chunk]);
      if (kh.length < kh_max_len) {
        kh = Buffer.concat([kh, Buffer.alloc(kh_max_len - kh.length, 0xee)]);
      }
      _hidDevice.sendReport(0, Uint8Array.from(kh));
      index++;
    }
  });
};

export default DigitalBitboxUsb;
