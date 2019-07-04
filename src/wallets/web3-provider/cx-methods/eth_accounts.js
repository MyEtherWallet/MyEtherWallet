/* eslint no-undef: 0 no-console:0 */
import { toPayload } from '../methods/jsonrpc';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_accounts') return next();
  const event = new CustomEvent(`web3${window.extensionID}getAccount`);
  window.dispatchEvent(event);
  window.addEventListener(
    `web3${window.extensionID}receiveAccount`,
    eventRes => {
      res(null, toPayload(payload.id, [eventRes.detail.account]));
      window.removeEventListener(
        `web3${window.extensionID}receiveAccount`,
        () => {}
      );
      window.removeEventListener(`web3${window.extensionID}reject`, () => {});
    }
  );

  window.addEventListener(`web3${window.extensionID}reject`, () => {
    res(null, toPayload(payload.id, new Error('User cancelled request!')));
    window.removeEventListener(
      `web3${window.extensionID}receiveAccount`,
      () => {}
    );
    window.removeEventListener(`web3${window.extensionID}reject`, () => {});
  });
};
