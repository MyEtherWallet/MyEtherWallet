import { Toast } from '@/helpers';
import Vue from 'vue';
const ERRORS = {
  27010: 'bcvaultError.invalid-device-pin-or-password',
  daemonError2: 'bcvaultError.closed-modal',
  daemonError1: 'bcvaultError.session-error',
  daemonError3: 'bcvaultError.https-issue',
  25601: 'bcvaultError.user-no-action',
  40449: 'bcvaultError.user-cancelled-action',
  daemonError0x6901: 'bcvaultError.daemon0x6901'
};
const WARNING = {
  jsError1: 'bcvaultError.browser-popup',
  jsErrormew1: 'bcvaultError.only-one-wallet',
  jsErrormew2: 'bcvaultError.can-only-sign-eth',
  jsErrormew3: 'bcvaultError.check-daemon',
  jsErrormew4: 'bcvaultError.no-account-found',
  jsErrormew5: 'bcvaultError.no-device-found'
};

export default err => {
  // eslint-disable-next-line
  console.log(err, JSON.stringify(err));
  // web errors
  if (err.hasOwnProperty('jsError')) {
    Toast.responseHandler(
      Vue.$i18n.t(WARNING[`jsError${err.jsError}`]),
      Toast.WARN
    );
    return;
  } else if (err.hasOwnProperty('BCHttpResponse')) {
    // request succeded but the device returned error
    Toast.responseHandler(
      Vue.$i18n.t(ERRORS[err.BCHttpResponse.errorCode]),
      Toast.ERROR
    );
    return;
  } else if (err.hasOwnProperty('HttpResponse')) {
    // request when the server errors
    Toast.responseHandler(err.HttpResponse, false);
  } else if (err.hasOwnProperty('DaemonHttpResponse')) {
    Toast.responseHandler(
      Vue.$i18n.t(ERRORS[`daemonError${err.DaemonHttpResponse.daemonError}`]),
      Toast.ERROR
    );
    return;
  } else {
    Toast.responseHandler(err, false);
  }
};
