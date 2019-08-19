/* eslint-disable no-undef */
import { MEW_TX_HASH } from '../cxEvents';

export default async ({ event, payload }, _, next) => {
  if (event !== MEW_TX_HASH) return next();
  window.dispatchEvent(
    new CustomEvent(
      WEB3_RECEIVE_TX_HASH.replace('{{id}}', window.extensionID),
      {
        detail: {
          payload: payload
        }
      }
    )
  );
};
