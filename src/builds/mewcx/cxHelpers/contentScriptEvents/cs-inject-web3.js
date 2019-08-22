/* eslint-disable no-undef */
import { CX_INJECT_WEB3 } from '../cxEvents';

export default async ({ event, id }, res, next) => {
  if (event !== CX_INJECT_WEB3) return next();
  const inject = fn => {
    const container = document.head || document.documentElement;
    const script = document.createElement('script');
    const idScript = document.createElement('script');
    script.setAttribute('id', 'mew-web3script');
    script.setAttribute('type', 'application/javascript');
    script.setAttribute('async', false);
    idScript.setAttribute('type', 'application/javascript');
    idScript.setAttribute('async', false);
    idScript.setAttribute('id', 'mew-extensionId');
    idScript.textContent = '(' + fn + ')("' + id + '")';
    script.src = chrome.extension.getURL(
      `${process.env.NODE_ENV === 'production' ? 'js/' : ''}cxWeb3.js`
    );
    if (!elementExists('mew-web3script')) container.appendChild(script);
    if (!elementExists('mew-extensionId')) container.appendChild(idScript);
  };
  const elementExists = eleId => {
    return document.getElementById(eleId) !== null;
  };
  inject(function(chromeid) {
    window.extensionID = chromeid;
  });

  res();
};
