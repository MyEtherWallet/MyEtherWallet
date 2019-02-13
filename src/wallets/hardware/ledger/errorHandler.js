import { Toast } from '@/helpers';
const ERRORS = {
  U2F_TIMEOUT: 'Failed to sign with Ledger device: U2F TIMEOUT',
  NO_LEDGER: 'No Ledger device found (timeout)',
  DEVICE_BUSY: 'Ledger Device is busy (lock signPersonalMessage)',
  UNKNOWN_ERROR_6804: 'Ledger device: UNKNOWN_ERROR (0x6804)',
  U2F_OTHER_ERROR:
    'TransportError: Failed to sign with Ledger device: U2F OTHER_ERROR'
};
export default err => {
  const errorValues = Object.values(ERRORS);
  if (errorValues.includes(err.message)) {
    Toast.responseHandler(err, true);
  } else {
    Toast.responseHandler(err, false);
  }
};
