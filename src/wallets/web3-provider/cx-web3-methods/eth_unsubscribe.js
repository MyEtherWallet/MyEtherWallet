import eventHandler from './eventHandler';
import {
  WEB3_UNSUBSCRIBE,
  WEB3_UNSUBSCRIBE_RES,
  WEB3_REJECT
} from '@/builds/mewcx/cxHelpers/cxEvents.js';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_unsubscribe') return next();
  const id = window.extensionID;
  const obj = {
    detail: payload
  };
  const eventName = WEB3_UNSUBSCRIBE.replace('{{id}}', id);
  const resName = WEB3_UNSUBSCRIBE_RES.replace('{{id}}', id);
  const errName = WEB3_REJECT.replace('{{id}}', id);

  eventHandler(eventName, obj, resName, errName)
    .then(response => {
      res(null, response);
    })
    .catch(e => {
      res(e);
    });
};
