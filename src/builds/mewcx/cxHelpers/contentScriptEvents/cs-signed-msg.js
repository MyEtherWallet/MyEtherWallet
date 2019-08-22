/* eslint-disable no-undef */
import { MEW_SIGNED_MSG, WEB3_RECEIVE_SIGNED_MSG } from '../cxEvents';

export default async ({ event, payload, id }, _, next) => {
  if (event !== MEW_SIGNED_MSG) return next();
  window.dispatchEvent(
    new CustomEvent(WEB3_RECEIVE_SIGNED_MSG.replace('{{id}}', id), {
      detail: {
        payload: payload
      }
    })
  );
};
