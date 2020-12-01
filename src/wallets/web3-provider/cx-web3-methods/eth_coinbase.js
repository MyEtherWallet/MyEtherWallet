/* eslint no-undef: 0 no-console:0 */
import eventHandler from './eventHandler';
import { toPayload } from '../jsonrpc';
import {
  WEB3_RECEIVE_ACC,
  WEB3_REJECT,
  WEB3_GET_ACC
} from '@/builds/mewcx/cxHelpers/cxEvents.js';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_coinbase') return next();
  const id = window.extensionID;
  const callerUrl = window.location.hostname;
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
      res(null, toPayload(payload.id, response.payload[0]));
    })
    .catch(e => {
      res(e);
    });
};
