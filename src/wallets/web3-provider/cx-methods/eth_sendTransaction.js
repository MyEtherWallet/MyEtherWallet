/* eslint no-undef: 0 no-console:0 */
import { toPayload } from '../methods/jsonrpc';
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
      const event = new CustomEvent(WEB3_SEND_TX.replace('{{id}}', id), {
        detail: {
          tx: _tx
        }
      });
      window.dispatchEvent(event);
      window.addEventListener(
        WEB3_RECEIVE_TX_HASH.replace('{{id}}', id),
        eventRes => {
          res(null, toPayload(payload.id, eventRes.detail.hash));
          window.removeEventListener(
            WEB3_RECEIVE_TX_HASH.replace('{{id}}', id),
            () => {}
          );
          window.removeEventListener(
            WEB3_REJECT.replace('{{id}}', id),
            () => {}
          );
        }
      );

      window.addEventListener(WEB3_REJECT.replace('{{id}}', id), () => {
        res(null, toPayload(payload.id, new Error('User Rejected action!')));
        window.removeEventListener(
          WEB3_RECEIVE_TX_HASH.replace('{{id}}', id),
          () => {}
        );
        window.removeEventListener(WEB3_REJECT.replace('{{id}}', id), () => {});
      });
    })
    .catch(() => {
      res(null, toPayload(payload.id, new Error('User Rejected action!')));
    });
};
