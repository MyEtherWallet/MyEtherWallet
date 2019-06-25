/* eslint no-undef: 0 no-console:0 */
import { toPayload } from '../methods/jsonrpc';
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_accounts') return next();
  const event = new CustomEvent(`web3${window.extensionID}getAccount`);
  window.dispatchEvent(event);
  window.addEventListener(
    `web3${window.extensionID}receiveAccount`,
    receiveAccount
  );
  // chrome.runtime.sendMessage(
  //   'eohbnnfmdailkcegaeeoplbdaggjbalo',
  //   { msg: 'fetchMewCXAccounts' },
  //   receiveAccount
  // );
  // chrome.runtime.onMessage(function(response, _, sendResponse) {
  //   if (response.msg)
  // });

  function receiveAccount(account) {
    console.log(account, 'received?');
    res(null, toPayload(payload.id, []));
  }
};
