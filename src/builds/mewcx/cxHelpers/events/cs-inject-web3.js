/* eslint-disable no-undef */
import { CX_INJECT_WEB3 } from '../cxEvents';

export default async ({ event, id }, _, next) => {
  if (event !== CX_INJECT_WEB3) return next();
  const inject = fn => {
    const script = document.createElement('script');
    const vendorsScript = document.createElement('script');
    vendorsScript.src = chrome.extension.getURL(
      `${process.env.NODE_ENV === 'production' ? 'js/' : ''}vendors.js`
    );
    vendorsScript.setAttribute('id', 'mew-vendor');
    vendorsScript.onload = () => {
      script.src = chrome.extension.getURL(
        `${process.env.NODE_ENV === 'production' ? 'js/' : ''}cxWeb3.js`
      );
      script.setAttribute('id', 'mew-web3script');
      document.head.appendChild(script);
    };
    if (!elementExists('mew-vendor')) document.head.appendChild(vendorsScript);
    const idScript = document.createElement('script');
    idScript.setAttribute('type', 'application/javascript');
    idScript.setAttribute('id', 'mew-extensionId');
    idScript.textContent = '(' + fn + ')("' + id + '")';
    if (!elementExists('mew-extensionId')) document.body.appendChild(idScript);
  };
  const elementExists = eleId => {
    return document.getElementById(eleId) !== null;
  };
  inject(function(chromeid) {
    window.extensionID = chromeid;
  });
};
