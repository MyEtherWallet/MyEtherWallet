/* eslint no-undef: 0 no-console:0 */
import { toPayload } from '../jsonrpc';
import {
  WEB3_RECEIVE_ACC,
  WEB3_REJECT,
  WEB3_GET_ACC
} from '@/builds/mewcx/cxHelpers/cxEvents.js';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_requestAccounts') return next();
  const id = window.extensionID;
  const callerUrl = window.location.hostname;
  const event = new CustomEvent(WEB3_GET_ACC.replace('{{id}}', id), {
    detail: {
      from: callerUrl
    }
  });
  window.dispatchEvent(event);
  window.addEventListener(WEB3_RECEIVE_ACC.replace('{{id}}', id), function(
    eventRes
  ) {
    res(null, toPayload(payload.id, [eventRes.detail.account]));
    this.removeEventListener(WEB3_RECEIVE_ACC.replace('{{id}}', id), () => {});
    this.removeEventListener(WEB3_REJECT.replace('{{id}}', id), () => {});
  });

  window.addEventListener(WEB3_REJECT.replace('{{id}}', id), function() {
    res(new Error('User cancelled request!'));
    this.removeEventListener(WEB3_RECEIVE_ACC.replace('{{id}}', id), () => {});
    this.removeEventListener(WEB3_REJECT.replace('{{id}}', id), () => {});
  });

  // const _this = window;
  // return new Promise((resolve, reject) => {
  //   const id = _this.extensionID;
  //   const callerUrl = _this.location.hostname;
  //   const event = new CustomEvent(WEB3_GET_ACC.replace('{{id}}', id), {
  //     detail: {
  //       from: callerUrl
  //     }
  //   });
  //   _this.dispatchEvent(event);
  //   _this.addEventListener(WEB3_RECEIVE_ACC.replace('{{id}}', id), function(
  //     eventRes
  //   ) {
  //     resolve([eventRes.detail.account]);
  //     // res(null, toPayload(payload.id, [eventRes.detail.account]));
  //     this.removeEventListener(
  //       WEB3_RECEIVE_ACC.replace('{{id}}', id),
  //       () => {}
  //     );
  //     this.removeEventListener(WEB3_REJECT.replace('{{id}}', id), () => {});
  //   });

  //   _this.addEventListener(WEB3_REJECT.replace('{{id}}', id), function() {
  //     reject(new Error('User cancelled request!'));
  //     // res(null, toPayload(payload.id, new Error('User cancelled request!')));
  //     this.removeEventListener(
  //       WEB3_RECEIVE_ACC.replace('{{id}}', id),
  //       () => {}
  //     );
  //     this.removeEventListener(WEB3_REJECT.replace('{{id}}', id), () => {});
  //   });
  // });
};
