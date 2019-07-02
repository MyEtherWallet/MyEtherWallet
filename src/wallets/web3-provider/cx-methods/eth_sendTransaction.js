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
        `web3${window.extensionID}recieveTx`,
        eventRes => {
          res(null, toPayload(payload.id, [eventRes.detail.tx]));
          window.removeEventListener(
            `web3${window.extensionID}recieveTx`,
            () => {}
          );
          window.removeEventListener(
            `web3${window.extensionID}reject`,
            () => {}
          );
        }
      );

      window.addEventListener(`web3${window.extensionID}reject`, () => {
        res(new Error('User cancelled request!'));
        window.removeEventListener(
          `web3${window.extensionID}recieveTx`,
          () => {}
        );
        window.removeEventListener(`web3${window.extensionID}reject`, () => {});
      });
    })
    .catch(e => {
      res(e);
    });
};
