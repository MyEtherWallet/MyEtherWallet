/* eslint no-undef: 0 no-console:0 */
import { toPayload } from '../methods/jsonrpc';
import { getSanitizedTx } from '../methods/utils';

export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_sendTransaction') return next();
  const tx = Object.assign({}, payload.params[0]);
  getSanitizedTx(tx)
    .then(_tx => {
      const event = new CustomEvent(`web3${window.extensionID}sendTx`, {
        detail: {
          tx: _tx
        }
      });
      window.dispatchEvent(event);
      window.addEventListener(
        `web3${window.extensionID}recieveTxHash`,
        eventRes => {
          res(null, toPayload(payload.id, eventRes.detail.hash));
          window.removeEventListener(
            `web3${window.extensionID}recieveTxHash`,
            () => {}
          );
          window.removeEventListener(
            `web3${window.extensionID}reject`,
            () => {}
          );
        }
      );

      window.addEventListener(`web3${window.extensionID}reject`, () => {
        res(null, toPayload(payload.id, null));
        window.removeEventListener(
          `web3${window.extensionID}recieveTxHash`,
          () => {}
        );
        window.removeEventListener(`web3${window.extensionID}reject`, () => {});
      });
    })
    .catch(() => {
      res(null, toPayload(payload.id, null));
    });
};
