import { toPayload } from '../jsonrpc';
import {
  WEB3_SUBSCRIBE,
  WEB3_SUBSCRIPTION,
  WEB3_REJECT
} from '@/builds/mewcx/cxHelpers/cxEvents.js';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_subscribe') return next();
  const id = window.extensionID;
  const actualEvent = new CustomEvent(WEB3_SUBSCRIBE.replace('{{id}}', id), {
    detail: payload
  });
  window.addEventListener(WEB3_SUBSCRIPTION.replace('{{id}}', id), response => {
    // window.ethereum.emit('notification', response.detail);
    console.log(response, 'just id');
    res(null, toPayload(payload, response.detail));
  });
  window.addEventListener(
    WEB3_SUBSCRIPTION.replace('{{id}}', id) + 'notification',
    response => {
      window.ethereum.emit('data', response.detail);
      console.log(response);
    }
  );
  window.addEventListener(WEB3_REJECT, response => {
    if (response.detail) {
      res(new Error(response.detail));
    } else {
      res(new Error('User cancelled request!'));
    }
  });
  window.dispatchEvent(actualEvent);
  // new Promise((resolve, reject) => {
  // })
  //   .then(res => {
  //     console.log(res, 'here???');
  //     res(null, toPayload(payload.id, res.payload));
  //   })
  //   .catch(e => {
  //     res(e);
  //   });
};
