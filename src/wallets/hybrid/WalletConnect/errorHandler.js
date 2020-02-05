import { Toast } from '@/helpers';
const ERRORS = {
  'User canceled': 'user cancelled the action',
  'QR Code Modal closed': 'QR code popup closed',
  'Call Request Rejected': 'Request rejected'
};
const WARNING = {};

export default err => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNING);
  if (errorValues.includes(err.message)) {
    Toast.responseHandler(ERRORS[err.message], Toast.ERROR);
  } else if (warningValues.includes(err.message)) {
    Toast.responseHandler(WARNING[err.message], Toast.WARN);
  } else {
    Toast.responseHandler(err, false);
  }
};
