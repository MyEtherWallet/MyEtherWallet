import { toPayload } from '../methods/jsonrpc';
import {
  WEB3_SEND_SIGN_MSG,
  WEB3_RECEIVE_SIGNED_MSG,
  WEB3_REJECT
} from '@/builds/mewcx/cxHelpers/cxEvents.js';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'personal_sign') return next();
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
    eventRes => {
      res(
        null,
        toPayload(payload.id, '0x' + eventRes.detail.signedMsg.toString('hex'))
      );
      window.removeEventListener(
        WEB3_RECEIVE_SIGNED_MSG.replace('{{id}}', id),
        () => {}
      );
      window.removeEventListener(WEB3_REJECT, () => {});
    }
  );

  window.addEventListener(WEB3_REJECT, () => {
    res(null, toPayload(payload.id, new Error('User Rejected action!')));
    window.removeEventListener(
      WEB3_RECEIVE_SIGNED_MSG.replace('{{id}}', id),
      () => {}
    );
    window.removeEventListener(WEB3_REJECT.replace('{{id}}', id), () => {});
  });
};
