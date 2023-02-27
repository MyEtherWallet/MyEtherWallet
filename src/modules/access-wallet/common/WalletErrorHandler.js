import {
  Toast,
  SUCCESS,
  WARNING,
  ERROR,
  SENTRY
} from '@/modules/toast/handler/handlerToast';
import { isObject } from 'lodash';
import Vue from 'vue';

const WalletErrorHandler = (errors, warnings, successes = []) => {
  const errorValues = Object.keys(errors);
  const warningValues = Object.keys(warnings);
  const successValues = Object.keys(successes);
  return err => {
    const foundError = errorValues.find(item => {
      const message =
        err && err.message
          ? isObject(err.message)
            ? err.message.message
            : err.message
          : err;
      if (!message) return false;
      return message.includes(item);
    });
    const foundWarning = warningValues.find(item => {
      const message =
        err && err.message
          ? isObject(err.message)
            ? err.message.message
            : err.message
          : err;
      if (!message) return false;
      return message.includes(item);
    });
    const foundSuccess = successValues.find(item => {
      const message =
        err && err.message
          ? isObject(err.message)
            ? err.message.message
            : err.message
          : err;
      if (!message) return false;
      return message.includes(item);
    });
    if (foundError) {
      return Toast(Vue.$i18n.t(errors[foundError]), {}, ERROR);
    } else if (foundWarning) {
      return Toast(Vue.$i18n.t(warnings[foundWarning]), {}, WARNING);
    } else if (foundSuccess) {
      return Toast(Vue.$i18n.t(successes[foundSuccess]), {}, SUCCESS);
    }
    return Toast(err, {}, SENTRY);
  };
};
export default WalletErrorHandler;
