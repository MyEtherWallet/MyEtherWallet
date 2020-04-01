/* eslint-disable no-undef */
import { CX_SIGN_MSG, REJECT_MEW_SIGN_MSG } from '../cxEvents';
import { toChecksumAddress } from '@/helpers/addressUtils';
import { Misc } from '@/helpers';

export default async ({ event, payload }, _, next) => {
  if (event !== CX_SIGN_MSG) return next();
  chrome.storage.sync.get(toChecksumAddress(payload.address), res => {
    if (res[toChecksumAddress(payload.address)]) {
      chrome.windows.create({
        url: chrome.runtime.getURL(
          `popupLoading.html#?navigate-to=sign-msg&url=${payload.url}&msgToSign=${payload.msgToSign}&address=${payload.address}`
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
            event: REJECT_MEW_SIGN_MSG,
            payload: "Can't sign messages from a burner account!"
          };
          chrome.tabs.sendMessage(tab[0].id, obj);
        }
      );
    }
  });
};
