/* eslint-disable no-undef */
import { CX_FETCH_MEW_ACCS, WEB3_GET_ACC } from '../cxEvents';
import helpers from '../helpers';
import { ExtensionHelpers } from '@/helpers';
import { isAddress } from '@/helpers/addressUtils';
export default async ({ event, payload }, _, next) => {
  if (event !== CX_FETCH_MEW_ACCS && event !== WEB3_GET_ACC) return next();
  const q = helpers.queryBuilder(payload);
  ExtensionHelpers.getAccounts(acc => {
    const accounts = Object.keys(acc).filter(item => {
      if (isAddress(item)) return item;
    });
    if (accounts.length > 0) {
      chrome.windows.create({
        url: chrome.runtime.getURL(
          `index.html#/extension-popups/account-access?connectionRequest=${payload.url}&${q}`
        ),
        type: 'popup',
        height: 500,
        width: 300,
        focused: true
      });
    } else {
      chrome.tabs.create({
        url: chrome.runtime.getURL(
          `index.html#/access-my-wallet?connectionRequest=${payload.url}`
        )
      });
    }
  });
};
