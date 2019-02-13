import { Toast } from '@/helpers';
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
    Toast.responseHandler(err, true);
  } else {
    Toast.responseHandler(err, false);
  }
};
