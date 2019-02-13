import { Toast } from '@/helpers';
const ERRORS = {
  NO_DEVICE_SELECTED: 'No device selected.'
};
export default err => {
  const errorValues = Object.values(ERRORS);
  if (errorValues.includes(err.message)) {
    Toast.responseHandler(err, true);
  } else {
    Toast.responseHandler(err, false);
  }
};
