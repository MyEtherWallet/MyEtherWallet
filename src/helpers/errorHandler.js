import * as Sentry from '@sentry/browser';

const ErrorHandler = (err, expected) => {
  if (expected) {
    console.error(err) // eslint-disable-line
    return err;
  }
  Sentry.captureException(err);
  return;
};

export default ErrorHandler;
