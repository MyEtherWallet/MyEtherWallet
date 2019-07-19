import { toPayload } from '../methods/jsonrpc';
import {
  WEB3_SEND_SIGN_MSG,
  WEB3_RECEIVE_SIGNED_MSG,
  WEB3_REJECT
} from '@/builds/mewcx/cxHelpers/cxEvents.js';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'personal_sign' && payload.method !== 'eth_sign')
    return next();
  const id = window.extensionID;
  const msg = payload.params[0];
  const address = payload.params[1];
  const event = new CustomEvent(WEB3_SEND_SIGN_MSG.replace('{{id}}', id), {
    detail: {
      msgToSign: msg,
      address: address
    }
  });
  window.dispatchEvent(event);
  window.addEventListener(
    WEB3_RECEIVE_SIGNED_MSG.replace('{{id}}', id),
    function(eventRes) {
      this.removeEventListener(
        WEB3_RECEIVE_SIGNED_MSG.replace('{{id}}', id),
        () => {}
      );
      this.removeEventListener(WEB3_REJECT.replace('{{id}}', id), () => {});
      res(null, toPayload(payload.id, eventRes.detail.signedMsg));
    }
  );

  window.addEventListener(WEB3_REJECT.replace('{{id}}', id), function() {
    this.removeEventListener(
      WEB3_RECEIVE_SIGNED_MSG.replace('{{id}}', id),
      () => {}
    );
    this.removeEventListener(WEB3_REJECT.replace('{{id}}', id), () => {});
    res(new Error('User rejected action!'));
  });
};
