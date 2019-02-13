import * as Sentry from '@sentry/browser';
import { Toast } from '@/toasted';
import * as ResponseEvents from './responseEvents';

const idxs = {
  1: 'appWarn',
  2: 'appSuccess',
  3: 'appError'
};

const responseHandler = (err, expected) => {
  if (expected) {
    Toast.global[idxs[expected]]({
      message: err.message ? err.message : err
    });
    return err;
  }
  Sentry.captureException(err);
  return;
};

export default { responseHandler, ...ResponseEvents };
