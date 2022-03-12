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
  "Returned values aren't valid": 'errorsGlobal.invalid-returned-values',
  'Invalid message type': 'errorsGlobal.invalid-message-type',
  'Device is used in another window':
    'errorsGlobal.device-used-in-another-window',
  'wrong previous session': 'errorsGlobal.wrong-previous-session',
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
  'connection not open': 'errorsGlobal.connection-not-open',
  'The execution failed due to an exception. Reverted':
    'The execution failed due to an exception. Reverted',
  '_window is null': 'Device busy'
};

const GLOBAL_WARNING = {
  'ENS is not supported on network private':
    'errorsGlobal.ens-not-supported-on-network-private'
};
const foundGlobalError = text => {
  const errorValues = Object.keys(GLOBAL_ERRORS);
  return errorValues.find(item => {
    return text.includes(item);
  });
};

const foundGlobalWarning = text => {
  const errorValues = Object.values(GLOBAL_WARNING);
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
  if (text instanceof Error || (text && text.hasOwnProperty('message'))) {
    text = text.message;
  }
  if (!text) {
    EventBus.$emit(
      ToastEvents[type],
      'Please provide text to display!',
      link,
      duration
    );
    return;
  }

  if (type === SENTRY) {
    if (foundGlobalError(text) || foundGlobalWarning(text)) {
      EventBus.$emit(
        ToastEvents[ERROR],
        Vue.$i18n.t(GLOBAL_ERRORS[text]),
        link,
        duration
      );
    } else {
      Sentry.captureException(text.originalError || text.error || text);
    }
    return;
  }
  EventBus.$emit(ToastEvents[type], text, link, duration);
};

export { SUCCESS, ERROR, WARNING, INFO, Toast, SENTRY };
