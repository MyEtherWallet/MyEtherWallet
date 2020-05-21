import { Toast } from '@/helpers';
import Vue from 'vue';
const ERRORS = {
  'Wrong password for app registration.': 'coolWalletError.wrong-password',
  'Card locked! Please unlock through the app': 'coolWalletError.card-locked',
  "App is already registered! If you're having trouble, please reregister the app by removing it from the wallet app.":
    'coolWalletError.already-registered',
  'Having issues with pairing CoolWallet': 'coolWalletError.no-wallet-instance',
  'navigator.bluetooth is undefined': 'coolWalletError.no-bluetooth'
};
const WARNING = {};

export default err => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNING);
  const foundError = errorValues.find(item => {
    return item.includes(err.message) || item.includes(err);
  });
  const foundWarning = warningValues.find(item => {
    return item.includes(err.message) || item.includes(err);
  });

  if (foundError) {
    Toast.responseHandler(`${Vue.$i18n.t(ERRORS[foundError])}`, Toast.ERROR);
  } else if (foundWarning) {
    Toast.responseHandler(`${Vue.$i18n.t(WARNING[foundWarning])}`, Toast.WARN);
  } else {
    Toast.responseHandler(err, false);
  }
};
