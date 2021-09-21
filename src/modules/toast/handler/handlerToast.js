import ToastEvents from './toastEvents';
import { EventBus } from '@/core/plugins/eventBus';
import * as Sentry from '@sentry/browser';
import Vue from 'vue';
const SUCCESS = 'success';
const ERROR = 'error';
const WARNING = 'warning';
const INFO = 'info';
const SENTRY = 'sentry';
const GLOBAL_ERRORS = {
  "Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from, requesting data from a block number that does not exist, or querying a node which is not fully synced.":
    'globalError.invalid-returned-values',
  'Invalid message type!': 'errorsGlobal.invalid-message-type',
  'Device is used in another window':
    'errorsGlobal.device-used-in-another-window',
  'Wrong previous session': 'errorsGlobal.wrong-previous-session',
  'Something went wrong in mnemonic wallet access':
    'errorsGlobal.mnemonic-wallet-access-error',
  'Expected public key to be an Uint8Array with length [33, 65]':
    'errorsGlobal.invalid-public-key-needs-to-be-int8Array-with-length-33-65',
  'Returned error: insufficient funds for transfer':
    'errorsGlobal.insufficient-funds-for-transfer',
  'Promise was rejected with a falsy value':
    'errorsGlobal.promise-rejected-with-falsy-value',
  'The operation is insecure.': 'errorsGlobal.the-operation-is-insecure',
  "CONNECTION ERROR: Couldn't connect to node on WS.":
    'errorsGlobal.connection-error-couldnt-connect-to-WS',
  'Failed to fetch': 'errorsGlobal.failed-to-fetch',
  'Non-Error promise rejection captured with keys: code, message':
    'errorsGlobal.non-error-promise-rejection-captured-with-keys-code-message',
  'Network Error': 'errorsGlobal.network-error',
  'connection not open': 'errorsGlobal.connection-not-open'
};
const foundGlobalError = text => {
  const errorValues = Object.keys(GLOBAL_ERRORS);
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
      EventBus.$emit(
        ToastEvents[ERROR],
        Vue.$i18n.t(GLOBAL_ERRORS[text]),
        link,
        duration
      );
    } else {
      Sentry.captureException(text);
    }
    return;
  }
  EventBus.$emit(ToastEvents[type], text, link, duration);
};

export { SUCCESS, ERROR, WARNING, INFO, Toast, SENTRY };
