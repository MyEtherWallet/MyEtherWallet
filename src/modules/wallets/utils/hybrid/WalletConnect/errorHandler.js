import { Toast, WARNING, ERROR, SENTRY } from '@/components/toast';
const ERRORS = {
  'User canceled': 'user cancelled the action',
  'QR Code Modal closed': 'QR code popup closed',
  'Call Request Rejected': 'Request rejected'
};
const WARNINGS = {};

export default err => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNINGS);
  if (errorValues.includes(err.message)) {
    Toast(ERRORS[err.message], {}, ERROR);
  } else if (warningValues.includes(err.message)) {
    Toast(WARNINGS[err.message], {}, WARNING);
  } else {
    Toast(err, {}, SENTRY);
  }
};
