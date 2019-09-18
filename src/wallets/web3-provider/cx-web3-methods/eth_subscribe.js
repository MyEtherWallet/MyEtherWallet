import { toPayload } from '../jsonrpc';
import {
  WEB3_SUBSCRIBE,
  WEB3_SUBSCRIBE_LISTENER,
  WEB3_SUBSCRIPTION_LISTENER,
  WEB3_REJECT
} from '@/builds/mewcx/cxHelpers/cxEvents.js';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_subscribe') return next();
  const id = window.extensionID;
  const actualEvent = new CustomEvent(WEB3_SUBSCRIBE.replace('{{id}}', id), {
    detail: payload
  });
  window.addEventListener(
    WEB3_SUBSCRIBE_LISTENER.replace('{{id}}', id),
    response => {
      res(null, toPayload(payload, response.detail));
    }
  );
  window.addEventListener(
    WEB3_SUBSCRIPTION_LISTENER.replace('{{id}}', id),
    response => {
      window.ethereum.emit('data', response.detail);
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
};
