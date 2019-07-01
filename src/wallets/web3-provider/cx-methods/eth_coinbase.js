/* eslint no-undef: 0 no-console:0 */
import { toPayload } from '../methods/jsonrpc';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_coinbase') return next();
  const event = new CustomEvent(`web3${window.extensionID}getCurrentAccount`);
  window.dispatchEvent(event);
  window.addEventListener(
    `web3${window.extensionID}receiveAccount`,
    eventRes => {
      res(null, toPayload(payload.id, eventRes.detail.account));
      window.removeEventListener(
        `web3${window.extensionID}receiveAccount`,
        () => {}
      );
    }
  );
};
