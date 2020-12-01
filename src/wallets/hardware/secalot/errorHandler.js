import { Toast } from '@/helpers';
import Vue from 'vue';

const ERRORS = {
  'Sign failed': 'secalotError.sign-failed',
  "Cannot read property 'requestId' of null": 'secalotError.not-connected',
  'Please update your Secalot firmware to version 4 or greater.':
    'secalotError.update-firmware-to-v4',
  'Ethereum wallet on your Secalot is not initialized.':
    'secalotError.wallet-not-initialized',
  'Invalid PIN-code. Be careful, after entering a wrong PIN-code three times in a row, your Secalot Ethereum wallet would be permanently wiped.':
    'secalotError.last-pin-try',
  'PIN-code not verified.': 'secalotError.invalid-pin-code',
  'Invalid PIN-code length.': 'secalotError.invalid-pin-code-length',
  'Operation timed out.': 'secalotError.timeout'
};
const WARNING = {};

export default err => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNING);
  const foundError = errorValues.find(item => {
    return item.includes(err.message) || item.includes(err);
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
