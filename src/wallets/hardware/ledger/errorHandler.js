import { Toast } from '@/helpers';
import Vue from 'vue';
const ERRORS = {
  'Failed to sign with Ledger device: U2F TIMEOUT': 'ledgerError.failedToSign',
  'No Ledger device found (timeout)': 'ledgerError.noDevice',
  'Ledger Device is busy': 'ledgerError.deviceBusy',
  'Ledger device: UNKNOWN_ERROR (0x6804)': 'ledgerError.unknown0x6804',
  'TransportError: Failed to sign with Ledger device: U2F OTHER_ERROR':
    'ledgerError.failedToSignOther',
  'Failed to sign with Ledger device: U2F DEVICE_INELIGIBLE':
    'ledgerError.failedSignIneligible',
  'Ledger device: UNKNOWN_ERROR (0x6801)': 'ledgerError.unknown0x6801',
  'Ledger device: Invalid data received (0x6a80)':
    'ledgerError.invalidData0x6a80',
  'Ledger device: CLA_NOT_SUPPORTED (0x6e00)':
    'ledgerError.claNotSupport0x6e00',
  'Invalid networkId signature returned.': 'ledgerError.invalidNetworkID'
};
const WARNING = {
  'Ledger device: Condition of use not satisfied (denied by the user?) (0x6985)':
    'ledgerError.deniedByUser0x6985',
  "U2F browser support is needed for Ledger. Please use Chrome, Opera or Firefox with a U2F extension. Also make sure you're on an HTTPS connection":
    'ledgerError.unsupportedBrowserU2f'
};

export default err => {
  const expected = err.message
    ? err.message.substr(err.message.indexOf('Expected'), err.message.length)
    : err.substr(err.indexOf('Expected'), err.message);
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNING);
  const foundError = errorValues.find(item => {
    if (err && err.message.includes(item)) return item;
    return item.includes(err.message) || item.includes(err);
  });

  const foundWarning = warningValues.find(item => {
    if (err && err.message.includes(item)) return item;
    return item.includes(err.message) || item.includes(err);
  });

  if (foundError) {
    Toast.responseHandler(
      `${Vue.$i18n.t(ERRORS[foundError])}${expected}`,
      Toast.ERROR
    );
  } else if (foundWarning) {
    Toast.responseHandler(
      `${Vue.$i18n.t(WARNING[foundWarning])}${expected}`,
      Toast.WARN
    );
  } else {
    Toast.responseHandler(err, false);
  }
};
