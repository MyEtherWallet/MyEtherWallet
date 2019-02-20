import { Toast } from '@/helpers';
import i18n from '@/translation.config.js';
const ERRORS = {
  'No device selected.': 'keepkeyError.noDeviceSelected'
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
    Toast.responseHandler(i18n.tc(ERRORS[foundError]), Toast.ERROR);
  } else if (foundWarning) {
    Toast.responseHandler(i18n.tc(WARNING[foundWarning]), Toast.WARN);
  } else {
    Toast.responseHandler(err, false);
  }
};
