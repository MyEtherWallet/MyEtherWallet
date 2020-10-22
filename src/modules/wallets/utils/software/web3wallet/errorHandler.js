import Toast from '@/components/toast';
const ERRORS = {
  REJECT_TX:
    'Returned error: Error: MetaMask Tx Signature: User denied transaction signature.',
  'User rejected action!': 'User rejected action!',
  "Can't sign messages from a burner account!":
    "Can't sign messages from a burner account!"
};
const WARNING = {};

export default err => {
  const errorValues = Object.values(ERRORS);
  const warningValues = Object.values(WARNING);
  if (errorValues.includes(err.message)) {
    Toast(err, {}, 'error');
  } else if (warningValues.includes(err.message)) {
    Toast(err, {}, 'warning');
  } else {
    Toast(err, {}, 'sentry');
  }
};
