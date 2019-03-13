import { Toast } from '@/helpers';
import Vue from 'vue';

const ERRORS = {
  'Popup closed': 'trezorError.popupClosed',
  'Device disconnected': 'trezorError.deviceDisconnect',
  'device disconnected during action': 'trezorError.deviceDisconnectAction',
  'Action cancelled by user': 'trezorError.userCancelledAction',
  'Permissions not granted': 'trezorError.noPermission',
  'Device call in progress': 'trezorError.callInProgress',
  'Transport is missing': 'trezorError.transportMissing',
  Cancelled: 'trezorError.cancelled'
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
