import * as Sentry from '@sentry/browser';
const ERRORS = {
  U2F_TIMEOUT: 'Failed to sign with Ledger device: U2F TIMEOUT',
  NO_LEDGER: 'No Ledger device found (timeout)',
  DEVICE_BUSY: 'Ledger Device is busy (lock signPersonalMessage)',
  UNKNOWN_ERROR_6804: 'Ledger device: UNKNOWN_ERROR (0x6804)'
};
const ErrorHandler = err => {
  const errorValues = Object.values(ERRORS);
  if (errorValues.includes(err.message)) {
    console.error(err.message, err); // eslint-disable-line
  } else {
    Sentry.captureException(err);
  }
};
export default ErrorHandler;
