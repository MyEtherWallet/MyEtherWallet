import eventHandler from './eventHandler';
import { toPayload } from '../jsonrpc';
import { getSanitizedTx } from '../methods/utils';
import {
  WEB3_SEND_TX,
  WEB3_RECEIVE_TX_HASH,
  WEB3_REJECT
} from '@/builds/mewcx/cxHelpers/cxEvents.js';

export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_sendTransaction') return next();
  const id = window.extensionID;
  const tx = Object.assign({}, payload.params[0]);
  getSanitizedTx(tx)
    .then(_tx => {
      const obj = {
        detail: {
          tx: _tx
        }
      };
      const eventName = WEB3_SEND_TX.replace('{{id}}', id);
      const resolveName = WEB3_RECEIVE_TX_HASH.replace('{{id}}', id);
      const rejectName = WEB3_REJECT.replace('{{id}}', id);

      eventHandler(eventName, obj, resolveName, rejectName)
        .then(response => {
          res(null, toPayload(payload.id, response.payload));
        })
        .catch(e => {
          res(e);
        });
    })
    .catch(e => {
      res(e);
    });
};
