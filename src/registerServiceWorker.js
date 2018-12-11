/* eslint-disable no-console */

import { register } from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      if (window) window.dispatchEvent(new Event('PWA_READY'));
    },
    registered() {
      if (window) window.dispatchEvent(new Event('PWA_REGISTERED'));
    },
    cached() {
      if (window) window.dispatchEvent(new Event('PWA_CACHED'));
    },
    updatefound() {
      if (window) window.dispatchEvent(new Event('PWA_NEWUPDATE'));
    },
    updated() {
      if (window) window.dispatchEvent(new Event('PWA_UPDATED'));
    },
    offline() {
      if (window) window.dispatchEvent(new Event('PWA_OFFLINE'));
    },
    error(error) {
      if (window) window.dispatchEvent(new Event('PWA_ERROR'), error);
    }
  });
}
