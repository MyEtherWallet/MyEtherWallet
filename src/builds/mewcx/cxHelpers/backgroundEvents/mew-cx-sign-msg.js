/* eslint-disable no-undef */
import { CX_SIGN_MSG } from '../cxEvents';

export default async ({ event, payload }, _, next) => {
  if (event !== CX_SIGN_MSG) return next();
  chrome.windows.create({
    url: chrome.runtime.getURL(
      `index.html#/extension-popups/sign-msg?url=${payload.url}&msgToSign=${payload.msgToSign}&address=${payload.address}`
    ),
    type: 'popup',
    height: 500,
    width: 300,
    focused: true
  });
};
