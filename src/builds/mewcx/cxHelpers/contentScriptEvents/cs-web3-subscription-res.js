/* eslint-disable no-undef */
import { WEB3_SUBSCRIBTION_RES, WEB3_SUBSCRIPTION_LISTENER } from '../cxEvents';

export default async ({ event, payload, id }, _, next) => {
  if (event !== WEB3_SUBSCRIBTION_RES) return next();
  window.dispatchEvent(
    new CustomEvent(WEB3_SUBSCRIPTION_LISTENER.replace('{{id}}', id), {
      detail: payload
    })
  );
};
