import ToastEvents from './toastEvents';
import { EventBus } from '@/plugins/eventBus';
import * as Sentry from '@sentry/browser';
export default (text, link, type) => {
  const acceptableTypes = ['success', 'error', 'warning', 'info', 'sentry'];
  if (!type && !acceptableTypes.includes(type)) {
    throw new Error(
      "Provided type is empty or not valid. Please provide one of the following as type: 'success', 'error', 'warning', 'sentry'"
    );
  }
  if (!text || text === '') throw new Error('Please provide text to display!');
  if (
    type === 'sentry' ||
    (typeof text === 'object' && text instanceof Error)
  ) {
    Sentry.captureException(text);
    return;
  }
  EventBus.$emit(ToastEvents[type], text, link);
};
