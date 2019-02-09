import { ErrorHandler } from '@/helpers';
const ERRORS = {
  NO_DEVICE_SELECTED: 'No device selected.'
};
export default err => {
  const errorValues = Object.values(ERRORS);
  if (errorValues.includes(err.message)) {
    ErrorHandler(err, true);
  } else {
    ErrorHandler(err, false);
  }
};
