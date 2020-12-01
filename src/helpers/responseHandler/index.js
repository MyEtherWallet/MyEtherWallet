import * as Sentry from '@sentry/browser';
import Vue from 'vue';
import * as ResponseEvents from './responseEvents';
import responseMatches from './responseMatches';

const idxs = {
  1: 'appWarn',
  2: 'appSuccess',
  3: 'appError',
  4: 'appInfo'
};

const responseHandler = (err, expected, options) => {
  const responseTranslation = Object.keys(responseMatches).find(item => {
    if (err.message) {
      return item === err.message;
    }
    return item === err;
  });

  if (expected) {
    Vue.toasted.global[idxs[expected]]({
      message: responseTranslation
        ? Vue.$i18n.t(responseMatches[responseTranslation])
        : err.message
        ? err.message
        : err,
      ...options
    });
    return err;
  }
  Sentry.captureException(err);
  return;
};

export default { responseHandler, ...ResponseEvents };
