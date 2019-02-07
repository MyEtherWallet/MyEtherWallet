import * as Sentry from '@sentry/browser';
const ERRORS = {
  NO_DEVICE_SELECTED: 'No device selected.'
};
const ErrorHandler = err => {
  const errorValues = Object.values(ERRORS);
  if (errorValues.includes(err.message)) {
        console.error(err.message, err); // eslint-disable-line
  } else {
    Sentry.captureException(err);
  }
};

export default ErrorHandler;
