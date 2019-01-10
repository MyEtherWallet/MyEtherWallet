'use strict';
import u2f from 'u2f-api';

const SecalotUsb = function(timeoutSeconds) {
  this.timeoutSeconds = timeoutSeconds;
};

SecalotUsb.webSafe64 = base64 =>
  base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
SecalotUsb.normal64 = base64 =>
  // eslint-disable-next-line
  base64.replace(/\-/g, '+').replace(/_/g, '/') +
  '=='.substring(0, (3 * base64.length) % 4);

SecalotUsb.prototype.u2fCallback = function(response, callback) {
  if (typeof response['signatureData'] !== 'undefined') {
    const data = Buffer.from(
      SecalotUsb.normal64(response['signatureData']),
      'base64'
    );
    callback(data.toString('hex'));
  } else {
    callback(undefined, response);
  }
};

SecalotUsb.prototype.exchange = function(apduHex, callback) {
  const apdu = Buffer.from('1122334455667788' + apduHex, 'hex');
  const challenge = Buffer.from(
    '0000000000000000000000000000000000000000000000000000000000000000',
    'hex'
  );
  const key = {};
  key['appId'] = location.origin;
  key['challenge'] = SecalotUsb.webSafe64(challenge.toString('base64'));
  key['version'] = 'U2F_V2';
  key['keyHandle'] = SecalotUsb.webSafe64(apdu.toString('base64'));
  const self = this;
  const localCallback = function(result) {
    self.u2fCallback(result, callback);
  };
  u2f.sign([key], this.timeoutSeconds).then(localCallback);
};

export default SecalotUsb;
