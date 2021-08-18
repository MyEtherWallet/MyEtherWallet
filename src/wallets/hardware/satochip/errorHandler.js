import { Toast } from '@/helpers';
import Vue from 'vue';

const ERRORS = {
  'Popup closed': 'satochipError.popup-closed',
  'Device disconnected': 'satochipError.device-disconnect',
  'device disconnected during action': 'satochipError.device-disconnect-action',
  'Action cancelled by user': 'satochipError.user-cancelled-action',
  'Permissions not granted': 'satochipError.no-permission',
  'Device call in progress': 'satochipError.call-in-progress',
  Cancelled: 'satochipError.cancelled',
  'Iframe timeout': 'satochipError.iframe-timeout',
  'popup failed to open': 'satochipError.popup-failed-to-open',
  'Satochip: error while connecting to Satochip-Bridge': 'satochipError.connect-error',
  'No response received from 2FA': 'satochipError.noresponse-2FA',
  'Signing request rejected by user': 'satochipError.rejected-2FA',
  'No card found': 'satochipError.no-card-found'
};

const WARNING = {};

export default err => {
  const errorValues = Object.keys(ERRORS);
  const warningValues = Object.keys(WARNING);
  const foundError = errorValues.find(item => {
    return (
      item.includes(err.message) ||
      item.includes(err) ||
      (err.message && err.message.includes(item)) ||
      (typeof err === 'string' && err.includes(item))
    );
  });

  const foundWarning = warningValues.find(item => {
    return err.message.includes(item) || item.includes(err);
  });

  if (foundError) {
    Toast.responseHandler(Vue.$i18n.t(ERRORS[foundError]), Toast.ERROR);
  } else if (foundWarning) {
    Toast.responseHandler(Vue.$i18n.t(WARNING[foundWarning]), Toast.WARN);
  } else {
    Toast.responseHandler(err, false);
  }
};
