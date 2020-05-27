import { Toast } from '@/helpers';
import Vue from 'vue';
const ERRORS = {
  'SecurityError: The operation is insecure.':
    'errorsGlobal.browser-not-supported'
};
const WARNING = {
  'Network Error': 'errorsGlobal.network-error',
  'Failed to fetch': 'errorsGlobal.network-error',
  'connection not open': 'errorsGlobal.network-error',
  'timeout of 15000ms exceeded': 'errorsGlobal.network-error',
  'ResizeObserver loop limit exceeded': ''
};
export default event => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNING);
  const foundError = errorValues.find(item => {
    return item.includes(event.value);
  });

  const foundWarning = warningValues.find(item => {
    return item.includes(event.value);
  });

  if (foundError) {
    if (ERRORS[foundError] !== '')
      Toast.responseHandler(Vue.$i18n.t(ERRORS[foundError]), Toast.ERROR);
    return true;
  } else if (foundWarning) {
    if (WARNING[foundWarning] !== '')
      Toast.responseHandler(Vue.$i18n.t(WARNING[foundWarning]), Toast.WARN);
    return true;
  }
  return false;
};
