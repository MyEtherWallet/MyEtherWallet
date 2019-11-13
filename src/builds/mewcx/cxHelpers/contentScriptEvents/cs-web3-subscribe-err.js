/* eslint-disable no-undef */
import { WEB3_SUBSCRIPTION_ERR } from '../cxEvents';

export default async ({ event, payload }, _, next) => {
  if (event !== WEB3_SUBSCRIPTION_ERR) return next();
  window.dispatchEvent(
    new CustomEvent(WEB3_REJECT, {
      detail: payload
    })
  );
};
