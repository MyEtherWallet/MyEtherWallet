import {
  Toast,
  WARNING,
  ERROR,
  SENTRY
} from '@/modules/toast/handler/handlerToast';
import Vue from 'vue';

const WalletErrorHandler = (errors, warnings) => {
  const errorValues = Object.keys(errors);
  const warningValues = Object.keys(warnings);
  return err => {
    const foundError = errorValues.find(item => {
      const message =
        err && err.message
          ? err.message.hasOwnProperty('message')
            ? err.message.message
            : err.message
          : err;
      if (!message) return false;
      return message.includes(item);
    });
    const foundWarning = warningValues.find(item => {
      const message =
        err && err.message
          ? err.message.hasOwnProperty('message')
            ? err.message.message
            : err.message
          : err;
      if (!message) return false;
      return message.includes(item);
    });
    if (foundError) {
      Toast(Vue.$i18n.t(errors[foundError]), {}, ERROR);
    } else if (foundWarning) {
      Toast(Vue.$i18n.t(warnings[foundWarning]), {}, WARNING);
    } else {
      Toast(err, {}, SENTRY);
    }
  };
};
export default WalletErrorHandler;
