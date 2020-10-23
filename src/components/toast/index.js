import ToastEvents from './toastEvents';
import Vue from 'vue';
import * as Sentry from '@sentry/browser';
export default (text, link, type) => {
  const acceptableTypes = ['success', 'error', 'warning', 'sentry'];
  if (!acceptableTypes.includes(type)) {
    throw new Error(
      "Provided type is empty or not valid. Please provide one of the following as type: 'success', 'error', 'warning', 'sentry'"
    );
  }
  if (!text || text === '') throw new Error('Please provide text to display!');
  if (type === 'sentry') {
    Sentry.captureException(text);
    return;
  }
  Vue.$eventHub.$emit(ToastEvents[type], text, link, type);
};
