import * as Sentry from '@sentry/browser';
import Vue from 'vue';
import * as ResponseEvents from './responseEvents';

const idxs = {
  1: 'appWarn',
  2: 'appSuccess',
  3: 'appError',
  4: 'appInfo'
};

const responseHandler = (err, expected) => {
  if (expected) {
    Vue.toasted.global[idxs[expected]]({
      message: err.message ? err.message : err
    });
    return err;
  }
  Sentry.captureException(err);
  return;
};

export default { responseHandler, ...ResponseEvents };
