import { Toast } from '@/helpers';
const ERRORS = {
  POPUP_CLOSED: 'Popup closed',
  DEVICE_DISCONNECTED: 'Device disconnected',
  DEVICE_DISCONNECTED_ACTION: 'device disconnected during action',
  ACTION_CANCELLED: 'Action cancelled by user',
  NO_PERMISSION: 'Permissions not granted',
  TRANSPORT_MISSING: 'Device call in progress'
};

const WARNING = {};

export default err => {
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
