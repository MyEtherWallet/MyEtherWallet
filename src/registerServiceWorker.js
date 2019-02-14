/* eslint-disable no-console */

import { register } from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    updated() {
      if (window) window.dispatchEvent(new Event('PWA_UPDATED'));
    }
  });
}
