import { ErrorHandler } from '@/helpers';
const ERRORS = {
  POPUP_CLOSED: 'Popup closed',
  DEVICE_DISCONNECTED: 'Device disconnected',
  DEVICE_DISCONNECTED_ACTION: 'device disconnected during action',
  ACTION_CANCELLED: 'Action cancelled by user',
  NO_PERMISSION: 'Permissions not granted'
};
export default err => {
  const errorValues = Object.values(ERRORS);
  if (errorValues.includes(err.message)) {
    console.error(err.message, err); // eslint-disable-line
  } else {
    ErrorHandler(err, false);
  }
};
