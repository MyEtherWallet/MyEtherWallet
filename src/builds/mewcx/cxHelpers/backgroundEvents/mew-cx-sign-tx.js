/* eslint-disable no-undef */
import { CX_CONFIRM_SEND_TX, REJECT_MEW_TX_SIGN } from '../cxEvents';
import helpers from '../helpers';
import { Misc } from '@/helpers';

export default async ({ event, payload }, _, next) => {
  if (event !== CX_CONFIRM_SEND_TX) return next();
  const q = helpers.queryBuilder(payload);
  chrome.storage.sync.get(payload.tx.from, res => {
    if (res[payload.tx.from]) {
      chrome.windows.create({
        url: chrome.runtime.getURL(
          `index.html#/extension-popups/sign-tx?url=${payload.url}&${q}`
        ),
        type: 'popup',
        height: 500,
        width: 300,
        focused: true
      });
    } else {
      chrome.tabs.query(
        { url: `*://*.${Misc.getService(payload.url)}/*` },
        function(tab) {
          const obj = {
            event: REJECT_MEW_TX_SIGN,
            payload: "Can't send txs from a burner account!"
          };
          chrome.tabs.sendMessage(tab[0].id, obj);
        }
      );
    }
  });
};
