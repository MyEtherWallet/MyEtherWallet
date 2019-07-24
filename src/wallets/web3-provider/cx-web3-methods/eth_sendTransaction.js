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
      const event = new CustomEvent(WEB3_SEND_TX.replace('{{id}}', id), {
        detail: {
          tx: _tx
        }
      });
      window.dispatchEvent(event);
      window.addEventListener(
        WEB3_RECEIVE_TX_HASH.replace('{{id}}', id),
        function(eventRes) {
          this.removeEventListener(
            WEB3_RECEIVE_TX_HASH.replace('{{id}}', id),
            () => {}
          );
          this.removeEventListener(WEB3_REJECT.replace('{{id}}', id), () => {});
          res(null, toPayload(payload.id, eventRes.detail.hash));
        }
      );

      window.addEventListener(WEB3_REJECT.replace('{{id}}', id), function() {
        this.removeEventListener(
          WEB3_RECEIVE_TX_HASH.replace('{{id}}', id),
          () => {}
        );
        this.removeEventListener(WEB3_REJECT.replace('{{id}}', id), () => {});
        res(new Error('User Rejected action!'));
      });
    })
    .catch(e => {
      res(e);
    });
};
