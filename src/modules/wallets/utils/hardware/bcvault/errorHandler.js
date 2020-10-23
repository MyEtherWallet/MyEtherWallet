import { Toast, WARNING, ERROR, SENTRY } from '@/components/toast';
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
const WARNINGS = {
  jsError1: 'bcvaultError.browser-popup',
  jsErrormew1: 'bcvaultError.only-one-wallet',
  jsErrormew2: 'bcvaultError.can-only-sign-eth',
  jsErrormew3: 'bcvaultError.check-daemon',
  jsErrormew4: 'bcvaultError.no-account-found',
  jsErrormew5: 'bcvaultError.no-device-found'
};

export default err => {
  // web errors
  if (err.hasOwnProperty('jsError')) {
    Toast(Vue.$i18n.t(WARNINGS[`jsError${err.jsError}`]), {}, WARNING);
    return;
  } else if (err.hasOwnProperty('BCHttpResponse')) {
    // request succeded but the device returned error
    Toast(Vue.$i18n.t(ERRORS[err.BCHttpResponse.errorCode]), {}, ERROR);
    return;
  } else if (err.hasOwnProperty('HttpResponse')) {
    // request when the server errors
    Toast(err.HttpResponse, {}, SENTRY);
  } else if (err.hasOwnProperty('DaemonHttpResponse')) {
    Toast(
      Vue.$i18n.t(ERRORS[`daemonError${err.DaemonHttpResponse.daemonError}`]),
      {},
      ERROR
    );
    return;
  } else {
    Toast(err, {}, SENTRY);
  }
};
