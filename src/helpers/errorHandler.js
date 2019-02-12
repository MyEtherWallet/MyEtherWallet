import * as Sentry from '@sentry/browser';
const idxs = {
  1: 'appWarn',
  2: 'appSuccess',
  3: 'appError'
};

const ErrorHandler = (err, expected, _this) => {
  if (expected) {
    _this.$toasted.global[idxs[expected]]({
      message: err.message ? err.message : err
    });
    return err;
  }
  Sentry.captureException(err);
  return;
};

export default ErrorHandler;
