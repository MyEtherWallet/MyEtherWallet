/* eslint-disable no-undef */
import { MEW_TX_HASH, WEB3_RECEIVE_TX_HASH } from '../cxEvents';

export default async ({ event, payload, id }, _, next) => {
  if (event !== MEW_TX_HASH) return next();
  window.dispatchEvent(
    new CustomEvent(WEB3_RECEIVE_TX_HASH.replace('{{id}}', id), {
      detail: {
        payload: payload
      }
    })
  );
};
