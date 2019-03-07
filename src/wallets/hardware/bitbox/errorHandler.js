import { Toast } from '@/helpers';
import Vue from 'vue';
const ERRORS = {
  'Sign failed': 'bitboxError.signFailed'
  // 'The BitBox received unexpected data. Was the correct password used? JSON parse error. 14 attempts remain before the device is reset.':
};
const WARNING = {};

export default err => {
  console.log(err);
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
