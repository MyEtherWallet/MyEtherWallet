import Toast from '@/components/toast';
import Vue from 'vue';
const ERRORS = {
  WrongPassword: 'coolWalletError.wrong-password',
  CardLocked: 'coolWalletError.card-locked',
  AlreadyRegistered: 'coolWalletError.already-registered',
  NoWalletInstance: 'coolWalletError.no-wallet-instance',
  'navigator.bluetooth is undefined': 'coolWalletError.no-bluetooth',
  MaxAppRegistered: 'coolWalletError.max-app-instance'
};
const WARNING = {};

export default err => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNING);
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
    Toast(`${Vue.$i18n.t(ERRORS[foundError])}`, {}, 'error');
  } else if (foundWarning) {
    Toast(`${Vue.$i18n.t(WARNING[foundWarning])}`, {}, 'warning');
  } else {
    Toast(err, {}, 'sentry');
  }
};
