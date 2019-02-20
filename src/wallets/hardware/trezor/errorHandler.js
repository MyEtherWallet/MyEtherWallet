import { Toast } from '@/helpers';
const ERRORS = {
  'Popup closed': 'Popup closed',
  'Device disconnected': 'Device disconnected',
  'device disconnected during action': 'device disconnected during action',
  'Action cancelled by user': 'Action cancelled by user',
  'Permissions not granted': 'Permissions not granted',
  'Device call in progress': 'Device call in progress'
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
