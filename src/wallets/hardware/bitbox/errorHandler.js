import { Toast } from '@/helpers';
const ERRORS = {
  'Sign failed': 'Sign failed'
};
const WARNING = {};

export default err => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNING);
  if (errorValues.includes(err.message)) {
    const idx = errorValues.findIndex(item => {
      return item.includes(err.message);
    });
    const message = idx !== -1 ? err.message : ERRORS[errorValues[idx]];
    Toast.responseHandler(message, Toast.ERROR);
  } else if (warningValues.includes(err.message)) {
    const idx = warningValues.findIndex(item => {
      return item.includes(err.message);
    });
    const message = idx !== -1 ? err.message : WARNING[errorValues[idx]];
    Toast.responseHandler(message, Toast.WARN);
  } else {
    Toast.responseHandler(err, false);
  }
};
