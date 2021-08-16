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
  'Private key does not satisfy the curve requirements (ie. it is invalid)',
  "Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from, requesting data from a block number that does not exist, or querying a node which is not fully synced."
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
