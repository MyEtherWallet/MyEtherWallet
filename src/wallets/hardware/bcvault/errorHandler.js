import { Toast } from '@/helpers';
import Vue from 'vue';
const ERRORS = {
  '0x6982': 'bcvaultError.invalid-device-pin-or-password',
  daemonError2: 'bcvaultError.user-cancelled-action',
  '0x6401': 'bcvaultError.user-no-action'
};
const WARNING = {
  jsError1: 'bcvaultError.browser-popup',
  jsErrormew1: 'bcvaultError.only-one-wallet'
};

export default err => {
  // web errors
  if (err.hasOwnProperty('jsError')) {
    Toast.responseHandler(
      `${Vue.$i18n.t(WARNING[`jsError${err.jsError}`])}`,
      Toast.WARN
    );
    return;
  } else if (err.hasOwnProperty('BCHttpResponse')) {
    // request succeded but the device returned error
    Toast.responseHandler(
      `${Vue.$i18n.t(ERRORS[err.BCHttpRespomse.errorCodeHex])}`
    );
    return;
  } else if (err.hasOwnProperty('HttpResponse')) {
    // request when the server errors
    Toast.responseHandler(err.HttpResponse, false);
  } else if (err.hasOwnProperty('DaemonHttpResponse')) {
    Toast.responseHandler(
      ERRORS[`daemonError${err.DaemonHttpResponse.daemonError}`]
    );
    return;
  } else {
    Toast.responseHandler(err, false);
  }
};
