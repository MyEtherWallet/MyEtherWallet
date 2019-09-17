import { toPayload } from '../jsonrpc';
import {
  WEB3_SUBSCRIBE,
  WEB3_SUBSCRIPTION,
  WEB3_REJECT
} from '@/builds/mewcx/cxHelpers/cxEvents.js';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_subscribe') return next();
  const id = window.extensionID;
  new Promise((resolve, reject) => {
    const actualEvent = new CustomEvent(WEB3_SUBSCRIBE.replace('{{id}}', id), {
      detail: payload
    });
    window.addEventListener(WEB3_SUBSCRIPTION.replace('{{id}}', id), res => {
      console.log('what', res);
      resolve(res.detail);
    });
    window.addEventListener(WEB3_REJECT, res => {
      console.log('what', res);
      if (res.detail) {
        reject(new Error(res.detail));
      } else {
        reject(new Error('User cancelled request!'));
      }
    });
    window.dispatchEvent(actualEvent);
  })
    .then(res => {
      res(null, toPayload(payload.id, res.payload));
    })
    .catch(e => {
      res(e);
    });
};
