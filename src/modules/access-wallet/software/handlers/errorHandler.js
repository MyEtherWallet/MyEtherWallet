import {
  Toast,
  WARNING,
  ERROR,
  SENTRY
} from '@/modules/toast/handler/handlerToast';
const ERRORS = [
  'public key only wallets needs a signer',
  'err',
  'Invalid networkId signature returned.',
  'Private key does not satisfy the curve requirements (ie. it is invalid)'
];
const WARNINGS = {};

export default err => {
  const errorValues = ERRORS;
  const warningValues = Object.values(WARNINGS);
  const foundError = errorValues.find(item => {
    if (err && err.message.includes(item)) return item;
    return item.includes(err.message) || item.includes(err);
  });
  if (foundError) {
    Toast(err.message, {}, ERROR);
  } else if (warningValues.includes(err.message)) {
    Toast(err.message, {}, WARNING);
  } else {
    Toast(err, {}, SENTRY);
  }
};
