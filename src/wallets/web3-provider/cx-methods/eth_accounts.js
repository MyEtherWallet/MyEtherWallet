/* eslint no-undef: 0 no-console:0 */
import { toPayload } from '../methods/jsonrpc';
const chrome = window.chrome;
export default async ({ payload }, res, next) => {
  if (payload.method !== 'eth_accounts') return next();
  chrome.runtime.sendMessage(
    'eohbnnfmdailkcegaeeoplbdaggjbalo',
    { msg: 'fetchMewCXAccounts' },
    receiveAccount
  );
  // chrome.runtime.onMessage(function(response, _, sendResponse) {
  //   if (response.msg)
  // });

  function receiveAccount(account) {
    console.log(account, 'received?');
  }

  res(null, toPayload(payload.id, []));
};
