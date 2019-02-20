import { Toast } from '@/helpers';
import Vue from 'vue';
const ERRORS = {
  'Failed to sign with Ledger device: U2F TIMEOUT': 'ledgerError.failedToSign',
  'No Ledger device found (timeout)': 'ledgerError.noDevice',
  'Ledger Device is busy (lock signPersonalMessage)': 'ledgerError.deviceBusy',
  'Ledger device: UNKNOWN_ERROR (0x6804)': 'ledgerError.unknown0x6804',
  'TransportError: Failed to sign with Ledger device: U2F OTHER_ERROR':
    'ledgerError.failedToSignOther'
};
const WARNING = {};

export default err => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNING);
  const foundError = errorValues.find(item => {
    return item.includes(err.message);
  });

  const foundWarning = warningValues.find(item => {
    return item.includes(err.message);
  });

  if (foundError) {
    Toast.responseHandler(Vue.$t(ERRORS[foundError]), Toast.ERROR);
  } else if (foundWarning) {
    Toast.responseHandler(Vue.$t(WARNING[foundWarning]), Toast.WARN);
  } else {
    Toast.responseHandler(err, false);
  }
};
