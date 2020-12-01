/* eslint-disable no-console */

import { register } from 'register-service-worker';
import { MEW_CX } from '@/builds/configs/types';

if (process.env.NODE_ENV === 'production' && BUILD_TYPE !== MEW_CX) {
  register(`${process.env.BASE_URL}service-worker.js`, {
    registrationOptions: { scope: './' },
    updated() {
      if (window) window.dispatchEvent(new Event('PWA_UPDATED'));
    },
    error() {
      if (window) window.dispatchEvent(new Event('PWA_MOUNT_ERROR'));
    }
  });
}
