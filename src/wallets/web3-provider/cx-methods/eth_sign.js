import { toPayload } from '../methods/jsonrpc';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'personal_sign') return next();
  const msg = payload.params[0];
  const address = payload.params[1];
  const event = new CustomEvent(`web3${window.extensionID}sendSignMsg`, {
    detail: {
      msgToSign: msg,
      address: address
    }
  });
  window.dispatchEvent(event);
  window.addEventListener(
    `web3${window.extensionID}recieveSignedMsg`,
    eventRes => {
      res(
        null,
        toPayload(payload.id, '0x' + eventRes.detail.signedMsg.toString('hex'))
      );
      window.removeEventListener(
        `web3${window.extensionID}recieveSignedMsg`,
        () => {}
      );
      window.removeEventListener(`web3${window.extensionID}reject`, () => {});
    }
  );

  window.addEventListener(`web3${window.extensionID}reject`, () => {
    res(null, toPayload(payload.id, new Error('User Rejected action!')));
    window.removeEventListener(
      `web3${window.extensionID}recieveTxHash`,
      () => {}
    );
    window.removeEventListener(`web3${window.extensionID}reject`, () => {});
  });
};
