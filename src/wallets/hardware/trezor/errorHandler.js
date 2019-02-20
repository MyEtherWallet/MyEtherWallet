import { Toast } from '@/helpers';
import Vue from 'vue';

const ERRORS = {
  'Popup closed': 'trezorError.popupClosed',
  'Device disconnected': 'trezorError.deviceDisconnect',
  'device disconnected during action': 'trezorError.deviceDisconnectAction',
  'Action cancelled by user': 'trezorError.userCancelledAction',
  'Permissions not granted': 'trezorError.noPermission',
  'Device call in progress': 'trezorError.callInProgress'
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
