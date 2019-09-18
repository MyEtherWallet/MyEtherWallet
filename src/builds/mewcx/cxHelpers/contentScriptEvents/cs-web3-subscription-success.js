/* eslint-disable no-undef */
import { WEB3_SUBSCRIPTION_RES, WEB3_SUBSCRIPTION } from '../cxEvents';

export default async ({ event, payload, id }, _, next) => {
  // console.log(event, payload);
  if (
    event !== WEB3_SUBSCRIPTION_RES &&
    event !== WEB3_SUBSCRIPTION_RES + 'notification'
  )
    return next();
  if (event === WEB3_SUBSCRIPTION_RES) {
    console.log('if');
    window.dispatchEvent(
      new CustomEvent(WEB3_SUBSCRIPTION.replace('{{id}}', id), {
        detail: payload
      })
    );
  } else {
    console.log('else');
    window.dispatchEvent(
      new CustomEvent(
        WEB3_SUBSCRIPTION.replace('{{id}}', id) + 'notification',
        {
          detail: payload
        }
      )
    );
  }
};
