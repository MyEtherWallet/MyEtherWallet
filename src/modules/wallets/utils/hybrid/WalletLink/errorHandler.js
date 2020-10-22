import Toast from '@/components/toast';
const ERRORS = {
  'User denied account authorization': 'user denied the authorization',
  'User denied transaction signature': 'user denied the transaction',
  'User denied message signature': 'user denied sign message',
  'Browser is blocking third-party localStorage usage. To continue, turn off third-party storage blocking or whitelist WalletLink.':
    'This Browser is not supported'
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
