import { Toast } from '@/helpers';
const ERRORS = {
  REJECT_TX:
    'Returned error: Error: MetaMask Tx Signature: User denied transaction signature.'
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
