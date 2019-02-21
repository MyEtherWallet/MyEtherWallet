import { Toast } from '@/helpers';
const ERRORS = {
  U2F_TIMEOUT: 'Failed to sign with Ledger device: U2F TIMEOUT',
  NO_LEDGER: 'No Ledger device found (timeout)',
  SIGN_FAILED_INELIGIBLE:
    'Failed to sign with Ledger device: U2F DEVICE_INELIGIBLE',
  DEVICE_BUSY_LOCK_MSG: 'Ledger Device is busy (lock signPersonalMessage)',
  DEVICE_BUSY_LOCK_TX: 'Ledger Device is busy (lock signTransaction)',
  UNKNOWN_ERROR_6804: 'Ledger device: UNKNOWN_ERROR (0x6804)',
  UNKNOWN_ERROR_6801: 'Ledger device: UNKNOWN_ERROR (0x6801)',
  U2F_OTHER_ERROR: 'Failed to sign with Ledger device: U2F OTHER_ERROR',
  INVALID_DATA: 'Ledger device: Invalid data received (0x6a80)',
  WRONG_APP: 'Ledger device: CLA_NOT_SUPPORTED (0x6e00)'
};
const WARNING = {
  DENIED_BY_USER:
    'Ledger device: Condition of use not satisfied (denied by the user?) (0x6985)'
};

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
