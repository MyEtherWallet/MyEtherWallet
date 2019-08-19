/* eslint-disable no-undef */
import { MEW_SIGNED_MSG } from '../cxEvents';

export default async ({ event, payload }, _, next) => {
  if (event !== MEW_SIGNED_MSG) return next();
  window.dispatchEvent(
    new CustomEvent(
      WEB3_RECEIVE_SIGNED_MSG.replace('{{id}}', window.extensionID),
      {
        detail: {
          payload: payload
        }
      }
    )
  );
};
