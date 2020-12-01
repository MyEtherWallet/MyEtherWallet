import { Toast, WARNING, ERROR, SENTRY } from '@/components/toast';
const ERRORS = {
  'User denied account authorization': 'user denied the authorization',
  'User denied transaction signature': 'user denied the transaction',
  'User denied message signature': 'user denied sign message',
  'Browser is blocking third-party localStorage usage. To continue, turn off third-party storage blocking or whitelist WalletLink.':
    'This Browser is not supported'
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
