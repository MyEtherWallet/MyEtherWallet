import * as Sentry from '@sentry/browser';

const ErrorHandler = (err, expected) => {
  if (expected) {
    return err;
  }
  Sentry.captureException(err);
  return;
};

export default ErrorHandler;
