import { Toast } from '@/helpers';
import Vue from 'vue';

const ERRORS = {
  'Popup closed': 'trezorError.popup-closed',
  'Device disconnected': 'trezorError.device-disconnect',
  'device disconnected during action': 'trezorError.device-disconnect-action',
  'Action cancelled by user': 'trezorError.user-cancelled-action',
  'Permissions not granted': 'trezorError.no-permission',
  'Device call in progress': 'trezorError.call-in-progress',
  'Transport is missing': 'trezorError.transport-missing',
  'EthAppPleaseEnableContractData: Please enable Contract data on the Ethereum app Settings':
    'trezorError.turn-on-contract-data',
  Cancelled: 'trezorError.cancelled',
  'Iframe timeout': 'trezor.iframe-timeout',
  'Browser not supported': 'trezor.unsupported-browser',
  'popup failed to open': 'trezor.popup-failed-to-open'
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
    Toast.responseHandler(Vue.$i18n.t(ERRORS[foundError]), Toast.ERROR);
  } else if (foundWarning) {
    Toast.responseHandler(Vue.$i18n.t(WARNING[foundWarning]), Toast.WARN);
  } else {
    Toast.responseHandler(err, false);
  }
};
