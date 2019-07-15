/* eslint no-undef: 0 no-console:0 */
import { toPayload } from '../methods/jsonrpc';
import {
  WEB3_RECEIVE_ACC,
  WEB3_GET_CURRENT_ACC
} from '@/builds/mewcx/cxHelpers/cxEvents.js';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_coinbase') return next();
  const id = window.extensionID;
  const event = new CustomEvent(WEB3_GET_CURRENT_ACC.replace('{{id}}', id));
  window.dispatchEvent(event);
  window.addEventListener(WEB3_RECEIVE_ACC.replace('{{id}}', id), eventRes => {
    res(null, toPayload(payload.id, eventRes.detail.account));
    window.removeEventListener(
      WEB3_RECEIVE_ACC.replace('{{id}}', id),
      () => {}
    );
  });
};
