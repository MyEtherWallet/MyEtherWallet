/* eslint-disable no-console */

import { register } from 'register-service-worker';
import { PWA_EVENTS } from '@/core/helpers/common';

const cleanupOldServiceWorkers = () => {
  if (!navigator.serviceWorker) return Promise.resolve();
  return navigator.serviceWorker
    .getRegistrations()
    .then(async registrations => {
      if (registrations.length > 1) {
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
      }
      const promiseChain = window.caches.keys().then(cacheNames => {
        if (cacheNames.length > 1) {
          return Promise.all(
            cacheNames.map(cacheName => window.caches.delete(cacheName))
          );
        }
        return Promise.resolve();
      });
      await promiseChain;
    });
};

if (import.meta.env.NODE_ENV === 'production') {
  cleanupOldServiceWorkers().then(() => {
    register(`${import.meta.env.BASE_URL}service-worker.js`, {
      registrationOptions: { scope: '/' },
      updatefound() {
        if (window)
          window.dispatchEvent(new Event(PWA_EVENTS.PWA_UPDATE_FOUND));
      },
      updated() {
        if (window) window.dispatchEvent(new Event(PWA_EVENTS.PWA_UPDATED));
      },
      error() {
        if (window) window.dispatchEvent(new Event(PWA_EVENTS.PWA_MOUNT_ERROR));
      }
    });
  });
}
