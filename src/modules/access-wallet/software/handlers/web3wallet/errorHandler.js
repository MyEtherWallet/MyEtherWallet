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
  'MetaMask Tx Signature: User denied transaction signature.':
    'Returned error: Error: MetaMask Tx Signature: User denied transaction signature.'
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
