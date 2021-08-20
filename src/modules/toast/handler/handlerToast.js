import ToastEvents from './toastEvents';
import { EventBus } from '@/core/plugins/eventBus';
import * as Sentry from '@sentry/browser';
const SUCCESS = 'success';
const ERROR = 'error';
const WARNING = 'warning';
const INFO = 'info';
const SENTRY = 'sentry';
const GLOBAL_ERRORS = {
  "Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from, requesting data from a block number that does not exist, or querying a node which is not fully synced.":
    "Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from, requesting data from a block number that does not exist, or querying a node which is not fully synced."
};
const foundGlobalError = text => {
  const errorValues = Object.values(GLOBAL_ERRORS);
  return errorValues.includes(text);
};
const Toast = (text, link, type, duration) => {
  const acceptableTypes = [SUCCESS, ERROR, WARNING, INFO, SENTRY];
  if (!type && !acceptableTypes.includes(type)) {
    EventBus.$emit(
      ToastEvents[type],
      'Provided type is empty or not valid. Please provide one of the following as type: ' +
        acceptableTypes.join(','),
      link,
      duration
    );
    return;
  }
  if (text instanceof Error) {
    text = text.message;
  }
  if (!text || text === '') {
    EventBus.$emit(
      ToastEvents[type],
      'Please provide text to display!',
      link,
      duration
    );
    return;
  }
  if (type === SENTRY) {
    if (foundGlobalError(text)) {
      EventBus.$emit(ToastEvents[ERROR], text, link, duration);
    } else {
      Sentry.captureException(text);
    }
    return;
  }
  EventBus.$emit(ToastEvents[type], text, link, duration);
};

export { SUCCESS, ERROR, WARNING, INFO, Toast, SENTRY };
