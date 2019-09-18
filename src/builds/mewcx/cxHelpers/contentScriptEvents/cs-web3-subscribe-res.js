/* eslint-disable no-undef */
import { WEB3_SUBSCRIBE_RES, WEB3_SUBSCRIBE_LISTENER } from '../cxEvents';

export default async ({ event, payload, id }, _, next) => {
  if (event !== WEB3_SUBSCRIBE_RES) return next();
  window.dispatchEvent(
    new CustomEvent(WEB3_SUBSCRIBE_LISTENER.replace('{{id}}', id), {
      detail: payload
    })
  );
};
