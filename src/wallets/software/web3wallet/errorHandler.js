import { Toast } from '@/helpers';
const ERRORS = {
  REJECT_TX:
    'Returned error: Error: MetaMask Tx Signature: User denied transaction signature.'
};
export default err => {
  const errorValues = Object.values(ERRORS);
  if (errorValues.includes(err.message)) {
    Toast.responseHandler(err, true);
  } else {
    Toast.responseHandler(err, false);
  }
};
