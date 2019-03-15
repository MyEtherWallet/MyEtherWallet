import { Toast } from '@/helpers';
import Vue from 'vue';
const ERRORS = {
  'Sign failed': 'bitboxError.signFailed',
  'The BitBox received unexpected data.': 'bitboxError.invalidPassword',
  'Aborted by user.': 'bitboxError.userAbortedAction'
};
const WARNING = {};

export default err => {
  const parsedErr = err.message
    ? err.message.replace(/\D/g, '')
    : err.replace(/\D/g, '');
  const attempts = parsedErr.length > 0 ? parsedErr : '';
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNING);
  const foundError = errorValues.find(item => {
    if (err && err.includes(item)) return item;
    return item.includes(err.message) || item.includes(err);
  });

  const foundWarning = warningValues.find(item => {
    if (err && err.includes(item)) return item;
    return item.includes(err.message) || item.includes(err);
  });

  if (foundError) {
    Toast.responseHandler(
      `${Vue.$i18n.t(ERRORS[foundError])}${attempts}`,
      Toast.ERROR
    );
  } else if (foundWarning) {
    Toast.responseHandler(
      `${Vue.$i18n.t(WARNING[foundWarning])}${attempts}`,
      Toast.WARN
    );
  } else {
    Toast.responseHandler(err, false);
  }
};
