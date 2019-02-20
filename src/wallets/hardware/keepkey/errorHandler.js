import { Toast } from '@/helpers';
const ERRORS = {
  'No device selected':
    'No device was selected. Please make sure your device is plugged in.'
};
const WARNING = {};

export default err => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNING);
  if (errorValues.includes(err.message)) {
    const idx = errorValues.indexOf(err.message);
    Toast.responseHandler(ERRORS[errorValues[idx]], Toast.ERROR);
  } else if (warningValues.includes(err.message)) {
    const idx = warningValues.indexOf(err.message);
    Toast.responseHandler(WARNING[errorValues[idx]], Toast.WARN);
  } else {
    Toast.responseHandler(err, false);
  }
};
