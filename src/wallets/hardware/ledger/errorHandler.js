import * as Sentry from '@sentry/browser';

const ErrorHandler = err => {
  Sentry.captureException(err);
};

export default ErrorHandler;
