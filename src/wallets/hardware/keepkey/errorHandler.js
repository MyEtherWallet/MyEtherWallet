import { Toast } from '@/helpers';
const ERRORS = {
  NO_DEVICE_SELECTED: 'No device selected.',
  INVALID_PIN: 'Invalid PIN',
  ALREADY_IN_USE: 'Unable to claim interface.'
};
const WARNING = {};

export default err => {
  console.log(err, err.message);
  const errorValues = Object.values(ERRORS);
  const warningValues = Object.values(WARNING);
  if (errorValues.includes(err.message)) {
    Toast.responseHandler(err, Toast.ERROR);
  } else if (warningValues.includes(err.message)) {
    Toast.responseHandler(err, Toast.WARN);
  } else {
    Toast.responseHandler(err, false);
  }
};
