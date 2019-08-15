/* eslint no-undef: 0 no-console:0 */
import eventHandler from './eventHandler';
import {
  WEB3_RECEIVE_ACC,
  WEB3_REJECT,
  WEB3_GET_ACC
} from '@/builds/mewcx/cxHelpers/cxEvents.js';
import { toPayload } from '../jsonrpc';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_requestAccounts') return next();
  const id = window.extensionID;
  const callerUrl = window.location.origin;
  const obj = {
    detail: {
      from: callerUrl
    }
  };
  const eventName = WEB3_GET_ACC.replace('{{id}}', id);
  const receiveEvent = WEB3_RECEIVE_ACC.replace('{{id}}', id);
  const rejectEvent = WEB3_REJECT.replace('{{id}}', id);
  eventHandler(eventName, obj, receiveEvent, rejectEvent)
    .then(response => {
      res(null, toPayload(payload.id, response.payload));
    })
    .catch(e => {
      res(e);
    });
};
