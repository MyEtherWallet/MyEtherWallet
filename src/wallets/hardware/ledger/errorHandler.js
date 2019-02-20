import { Toast } from '@/helpers';
const ERRORS = {
  'Failed to sign with Ledger device: U2F TIMEOUT':
    'Your Ledger device has timed out.',
  'No Ledger device found (timeout)':
    'No Ledger device found. Please make sure device is connected.',
  'Ledger Device is busy (lock signPersonalMessage)':
    'Ledger device is currently busy.',
  'Ledger device: UNKNOWN_ERROR (0x6804)': 'Ledger device errored. (0x6804)',
  'TransportError: Failed to sign with Ledger device: U2F OTHER_ERROR':
    'Ledger signing failed'
};
const WARNING = {};

export default err => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNING);
  if (errorValues.includes(err.message)) {
    const idx = errorValues.indexOf(err.message);
    Toast.responseHandler(ERRORS[errorValues[idx]], Toast.ERROR);
  } else if (warningValues.includes(err.message)) {
    const idx = warningValues.indexOf(err.message);
    Toast.responseHandler(WARNING[errorValues[idx]], Toast.WARN);
  } else {
    Toast.responseHandler(err, false);
  }
};
