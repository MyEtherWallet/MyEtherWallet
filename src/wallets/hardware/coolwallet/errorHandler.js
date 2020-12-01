import { Toast } from '@/helpers';
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
    Toast.responseHandler(`${Vue.$i18n.t(ERRORS[foundError])}`, Toast.ERROR);
  } else if (foundWarning) {
    Toast.responseHandler(`${Vue.$i18n.t(WARNING[foundWarning])}`, Toast.WARN);
  } else {
    Toast.responseHandler(err, false);
  }
};
