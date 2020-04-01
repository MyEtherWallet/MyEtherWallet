/* eslint-disable no-undef */
import { CX_CONFIRM_SEND_TX, REJECT_MEW_TX_SIGN } from '../cxEvents';
import { toChecksumAddress } from '@/helpers/addressUtils';
import helpers from '../helpers';
import { Misc } from '@/helpers';

export default async ({ event, payload }, _, next) => {
  if (event !== CX_CONFIRM_SEND_TX) return next();
  const q = helpers.queryBuilder(payload);
  const checksummedAddress = toChecksumAddress(payload.tx.from);
  chrome.storage.sync.get(checksummedAddress, res => {
    if (res[checksummedAddress]) {
      chrome.windows.create({
        url: chrome.runtime.getURL(
          `popupLoading.html#?navigate-to=sign-tx&url=${payload.url}&${q}`
        ),
        type: 'popup',
        height: 487,
        width: 300,
        focused: true
      });
    } else {
      chrome.tabs.query(
        { url: `*://*.${Misc.getService(payload.url)}/*` },
        function (tab) {
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
