import { toPayload } from '../jsonrpc';
import eventHandler from './eventHandler';
import {
  WEB3_SEND_SIGN_MSG,
  WEB3_RECEIVE_SIGNED_MSG,
  WEB3_REJECT
} from '@/builds/mewcx/cxHelpers/cxEvents.js';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'personal_sign' && payload.method !== 'eth_sign')
    return next();
  const id = window.extensionID;
  const address =
    payload.method === 'personal_sign' ? payload.params[1] : payload.params[0];
  const msg =
    payload.method === 'personal_sign' ? payload.params[0] : payload.params[1];
  const obj = {
    detail: {
      msgToSign: msg,
      address: address
    }
  };

  const eventName = WEB3_SEND_SIGN_MSG.replace('{{id}}', id);
  const resName = WEB3_RECEIVE_SIGNED_MSG.replace('{{id}}', id);
  const errName = WEB3_REJECT.replace('{{id}}', id);

  eventHandler(eventName, obj, resName, errName)
    .then(response => {
      res(null, toPayload(payload.id, response.payload));
    })
    .catch(e => {
      res(e);
    });
};
