import { Toast } from '@/helpers';
import Vue from 'vue';

const ERRORS = {
  Unexpected: 'bitbox02Error.unexpected',
  'User abort': 'bitbox02Error.user-abort',
  Uninitialized: 'bitbox02Error.not-initialized',
  'Firmware upgrade required': 'bitbox02Error.upgrade-firmware',
  'Unsupported firmware': 'bitbox02Error.unsupported-firmware',
  'Origin not whitelisted': 'bitbox02Error.unsupported-origin',
  'BitBoxBridge not found': 'bitbox02Error.no-bridge',
  'Expected one BitBox02': 'bitbox02Error.expected-one',
  'Pairing rejected': 'bitbox02Error.pairing-rejected',
  'Your BitBox02 is busy': 'bitbox02Error.busy',
  'Unsupported device': 'bitbox02Error.unsupported-device'
};

const WARNING = {
  'Attestation failed': 'bitbox02Error.attestation-failed'
};

export default err => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNING);
  const foundError = errorValues.find(item => {
    return (
      item.includes(err.message) ||
      item.includes(err) ||
      (err.message && err.message.includes(item)) ||
      (typeof err === 'string' && err.includes(item))
    );
  });

  const foundWarning = warningValues.find(item => {
    return item.includes(err.message) || item.includes(err);
  });

  if (foundError) {
    Toast.responseHandler(Vue.$i18n.t(ERRORS[foundError]), Toast.ERROR);
  } else if (foundWarning) {
    Toast.responseHandler(Vue.$i18n.t(WARNING[foundWarning]), Toast.WARN);
  } else {
    Toast.responseHandler(err, false);
  }
};
