import Toast from '@/components/toast';
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
    Toast(ERRORS[err.message], {}, 'error');
  } else if (warningValues.includes(err.message)) {
    Toast(WARNING[err.message], {}, 'warning');
  } else {
    Toast(err, {}, 'sentry');
  }
};
