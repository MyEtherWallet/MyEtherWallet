import { Toast } from '@/helpers';
import Vue from 'vue';
const ERRORS = {
  'No device selected.': 'keepkeyError.noDeviceSelected',
  'Invalid PIN': 'keepkeyError.invalidPin',
  'Unable to claim interface.': 'keepKey.cantClaim'
};
const WARNING = {};
export default err => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNING);
  const foundError = errorValues.find(item => {
    return item.includes(err.message);
  });

  const foundWarning = warningValues.find(item => {
    return item.includes(err.message);
  });

  if (foundError) {
    Toast.responseHandler(Vue.$i18n.t(ERRORS[foundError]), Toast.ERROR);
  } else if (foundWarning) {
    Toast.responseHandler(Vue.$i18n.t(WARNING[foundWarning]), Toast.WARN);
  } else {
    Toast.responseHandler(err, false);
  }
};
