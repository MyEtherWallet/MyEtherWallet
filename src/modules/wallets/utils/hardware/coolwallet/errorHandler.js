import { Toast, WARNING, ERROR, SENTRY } from '@/components/toast';
import Vue from 'vue';
const ERRORS = {
  WrongPassword: 'coolWalletError.wrong-password',
  CardLocked: 'coolWalletError.card-locked',
  AlreadyRegistered: 'coolWalletError.already-registered',
  NoWalletInstance: 'coolWalletError.no-wallet-instance',
  'navigator.bluetooth is undefined': 'coolWalletError.no-bluetooth',
  MaxAppRegistered: 'coolWalletError.max-app-instance'
};
const WARNINGS = {};

export default err => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNINGS);
  const foundError = errorValues.find(item => {
    return (
      (err.name && err.name.includes(item)) ||
      item.includes(err.message) ||
      err.includes(item)
    );
  });
  const foundWarning = warningValues.find(item => {
    return (
      (err.name && err.name.includes(item)) ||
      item.includes(err.message) ||
      err.includes(item)
    );
  });

  if (foundError) {
    Toast(`${Vue.$i18n.t(ERRORS[foundError])}`, {}, ERROR);
  } else if (foundWarning) {
    Toast(`${Vue.$i18n.t(WARNINGS[foundWarning])}`, {}, WARNING);
  } else {
    Toast(err, {}, SENTRY);
  }
};
