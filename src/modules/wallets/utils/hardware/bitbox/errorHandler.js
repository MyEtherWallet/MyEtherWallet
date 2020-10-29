import { Toast, WARNING, ERROR, SENTRY } from '@/components/toast';
import Vue from 'vue';
const ERRORS = {
  errorUnexpected: 'bitboxError.unexpected',
  errorInvalidPassword: 'bitboxError.invalid-password',
  errorUserAbort: 'bitboxError.user-abort',
  errorUserTimeout: 'bitboxError.user-timeout',
  errorNotInitialized: 'bitboxError.not-initialized',
  errorUpgradeFirmware: 'bitboxError.upgrade-firmware',
  errorUnsupportedFirmware: 'bitboxError.unsupported-firmware'
};
const WARNINGS = {};

export default err => {
  const loginsRemaining = err.message
    ? err.message.replace(/\D/g, '')
    : err.replace(/\D/g, '');
  const attempts = loginsRemaining.length > 0 ? loginsRemaining : '';
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNINGS);
  const foundError = errorValues.find(item => {
    return err.message ? err.message.includes(item) : err.includes(item);
  });
  const foundWarning = warningValues.find(item => {
    return err.message ? err.message.includes(item) : err.includes(item);
  });

  if (foundError) {
    Toast(`${Vue.$i18n.t(ERRORS[foundError])}${attempts}`, {}, ERROR);
  } else if (foundWarning) {
    Toast(`${Vue.$i18n.t(WARNINGS[foundWarning])}${attempts}`, {}, WARNING);
  } else {
    Toast(err, {}, SENTRY);
  }
};
