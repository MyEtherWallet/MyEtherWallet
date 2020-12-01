import { Toast, WARNING, ERROR, SENTRY } from '@/components/toast';
import Vue from 'vue';
const ERRORS = {
  'No device selected.': 'keepkeyError.no-device-selected',
  'Invalid PIN': 'keepkeyError.invalid-pin',
  'Unable to claim interface.': 'keepKey.cant-claim',
  'WebUSB is not available in this browser. We recommend trying Chrome.':
    'keepKey.browser-not-supported',
  'Unexpected Message': 'keepKey.generic-error',
  'Unknown message type received': 'keepKey.generic-error'
};
const WARNINGS = {};
export default err => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNINGS);
  const foundError = errorValues.find(item => {
    return item.includes(err.message) || item.includes(err);
  });

  const foundWarning = warningValues.find(item => {
    return item.includes(err.message) || item.includes(err);
  });

  if (foundError) {
    Toast(Vue.$i18n.t(ERRORS[foundError]), {}, ERROR);
  } else if (foundWarning) {
    Toast(Vue.$i18n.t(WARNINGS[foundWarning]), {}, WARNING);
  } else {
    Toast(err, {}, SENTRY);
  }
};
