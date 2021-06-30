/* eslint-disable no-console */

import { register } from 'register-service-worker';
import { PWA_EVENTS } from '@/core/helpers/common';
if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    registrationOptions: { scope: './' },
    updatefound() {
      if (window) window.dispatchEvent(new Event(PWA_EVENTS.PWA_UPDATE_FOUND));
    },
    updated() {
      if (window) window.dispatchEvent(new Event(PWA_EVENTS.PWA_UPDATED));
    },
    error() {
      if (window) window.dispatchEvent(new Event(PWA_EVENTS.PWA_MOUNT_ERROR));
    }
  });
}
