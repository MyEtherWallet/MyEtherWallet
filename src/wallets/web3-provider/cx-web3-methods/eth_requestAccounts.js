/* eslint no-undef: 0 no-console:0 */
// import { toPayload } from '../jsonrpc';
import {
  // WEB3_RECEIVE_ACC,
  // WEB3_REJECT,
  WEB3_GET_ACC
} from '@/builds/mewcx/cxHelpers/cxEvents.js';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_requestAccounts') return next();
  const id = window.extensionID;
  const callerUrl = window.location.origin;
  const obj = {
    detail: {
      from: callerUrl,
      cb: res
    }
  };
  const eventName = WEB3_GET_ACC.replace('{{id}}', id);
  const event = new CustomEvent(eventName, obj);
  console.log(event);
  window.dispatchEvent(event);
  // window.addEventListener(WEB3_RECEIVE_ACC.replace('{{id}}', id), function(
  //   eventRes
  // ) {
  //   res(null, toPayload(payload.id, eventRes.detail.payload));
  //   this.removeEventListener(WEB3_RECEIVE_ACC.replace('{{id}}', id), () => {});
  //   this.removeEventListener(WEB3_REJECT.replace('{{id}}', id), () => {});
  // });

  // window.addEventListener(WEB3_REJECT.replace('{{id}}', id), function() {
  //   res(new Error('User cancelled request!'));
  //   this.removeEventListener(WEB3_RECEIVE_ACC.replace('{{id}}', id), () => {});
  //   this.removeEventListener(WEB3_REJECT.replace('{{id}}', id), () => {});
  // });
};
