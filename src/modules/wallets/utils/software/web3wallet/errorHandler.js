const Toast = {
  responseHandler: (err, type) => {
    // eslint-disable-next-line
console.log(err, type);
  },
  ERROR: 'error',
  WARN: 'warn'
};
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
    Toast.responseHandler(err, Toast.ERROR);
  } else if (warningValues.includes(err.message)) {
    Toast.responseHandler(err, Toast.WARN);
  } else {
    Toast.responseHandler(err, false);
  }
};
