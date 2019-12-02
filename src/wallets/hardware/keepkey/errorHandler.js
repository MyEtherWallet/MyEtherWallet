import { Toast } from '@/helpers';
import Vue from 'vue';
const ERRORS = {
  'No device selected.': 'keepkeyError.no-device-selected',
  'Invalid PIN': 'keepkeyError.invalid-pin',
  'Unable to claim interface.': 'keepKey.cant-claim',
  'WebUSB is not available in this browser. We recommend trying Chrome.':
    'keepKey.browser-not-supported'
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
