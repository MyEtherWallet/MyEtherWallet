import {
  Toast,
  WARNING,
  ERROR,
  SENTRY
} from '@/modules/toast/handler/handlerToast';
const ERRORS = {
  REJECT_TX:
    'Returned error: Error: MetaMask Tx Signature: User denied transaction signature.',
  'User rejected action!': 'User rejected action!',
  "Can't sign messages from a burner account!":
    "Can't sign messages from a burner account!",
  "Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from, requesting data from a block number that does not exist, or querying a node which is not fully synced.":
    "Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from, requesting data from a block number that does not exist, or querying a node which is not fully synced."
};
const WARNINGS = {};

export default err => {
  const errorValues = Object.values(ERRORS);
  const warningValues = Object.values(WARNINGS);
  if (errorValues.includes(err.message)) {
    Toast(err.message, {}, ERROR);
  } else if (warningValues.includes(err.message)) {
    Toast(err.message, {}, WARNING);
  } else {
    Toast(err, {}, SENTRY);
  }
};
