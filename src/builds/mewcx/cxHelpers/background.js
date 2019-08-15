import cxHelpers from './cxHelpers';
import MiddleWare from '@/wallets/web3-provider/middleware';
import { web3RpcRequest, mewCxFetchAccounts, web3Detected } from './events';
import store from '@/store';
store.dispatch('setWeb3Instance');
import {
  CX_INJECT_WEB3
  // CX_SIGN_MSG,
  // CX_CONFIRM_SEND_TX,
  // CX_WEB3_DETECTED,
  // CX_FETCH_MEW_ACCS,
  // CX_GO_TO_MAIN_PAGE
} from './cxEvents';
const chrome = window.chrome;
const urls = {};
// eslint-disable-next-line
let metamaskChecker;
const eventsListeners = (request, _, callback) => {
  const obj = {
    event: request.event,
    payload: request.payload
  };
  const middleware = new MiddleWare();
  middleware.use(mewCxFetchAccounts);
  middleware.use(web3RpcRequest);
  middleware.use(web3Detected);
  middleware.run(obj, callback);
  return true;
  // let q;
  // if (request.hasOwnProperty('meta') && Object.keys(request.meta).length > 0) {
  //   const arr = [];
  //   for (const i in request.meta) {
  //     if (request.meta.hasOwnProperty(i)) {
  //       arr.push(
  //         encodeURIComponent(i.replace('og:', '')) +
  //           '=' +
  //           encodeURIComponent(request.meta[i])
  //       );
  //     }
  //   }
  //   q = arr.join('&');
  // } else if (
  //   request.hasOwnProperty('tx') &&
  //   Object.keys(request.tx).length > 0
  // ) {
  //   const arr = [];
  //   for (const i in request.tx) {
  //     if (request.tx.hasOwnProperty(i)) {
  //       arr.push(
  //         encodeURIComponent(i) + '=' + encodeURIComponent(request.tx[i])
  //       );
  //     }
  //   }
  //   q = arr.join('&');
  // }
  // switch (request.msg) {
  //   case CX_GO_TO_MAIN_PAGE:
  //     chrome.tabs.create({
  //       url: chrome.runtime.getURL(`index.html#/access-my-wallet`)
  //     });
  //     break;
  //   case CX_FETCH_MEW_ACCS:
  //     chrome.windows.create({
  //       url: chrome.runtime.getURL(
  //         `index.html#/extension-popups/account-access?connectionRequest=${request.url}&${q}`
  //       ),
  //       type: 'popup',
  //       height: 500,
  //       width: 300,
  //       focused: true
  //     });
  //     break;
  //   case CX_WEB3_DETECTED:
  //     chrome.storage.sync.get('warned', item => {
  //       if (Object.keys(item).length === 0) {
  //         clearTimeout(metamaskChecker);
  //         chrome.windows.create({
  //           url: chrome.runtime.getURL(
  //             `index.html#/extension-popups/web3-detected`
  //           ),
  //           type: 'popup',
  //           height: 500,
  //           width: 300,
  //           focused: true
  //         });
  //         chrome.storage.sync.set({ warned: 'true' });
  //         metamaskChecker = setTimeout(function() {
  //           chrome.storage.remove('warned');
  //         }, 900000);
  //       }
  //     });
  //     break;
  //   case CX_CONFIRM_SEND_TX:
  //     chrome.windows.create({
  //       url: chrome.runtime.getURL(
  //         `index.html#/extension-popups/sign-tx?url=${request.url}&${q}`
  //       ),
  //       type: 'popup',
  //       height: 500,
  //       width: 300,
  //       focused: true
  //     });
  //     break;
  //   case CX_SIGN_MSG:
  //     chrome.windows.create({
  //       url: chrome.runtime.getURL(
  //         `index.html#/extension-popups/sign-msg?url=${request.url}&msgToSign=${request.msgToSign}&address=${request.address}`
  //       ),
  //       type: 'popup',
  //       height: 500,
  //       width: 300,
  //       focused: true
  //     });
  //     break;
  // }
  // return true;
};
chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
  querycB(tabs);
});

chrome.tabs.onUpdated.addListener(onUpdatedCb);
chrome.tabs.onActivated.addListener(onActivatedCb);
chrome.tabs.onRemoved.addListener(onRemovedCb);

function onRemovedCb(id) {
  chrome.storage.sync.remove(urls[id]);
  delete urls[id];
}

function onUpdatedCb(_, __, tab) {
  chrome.runtime.onMessage.removeListener(eventsListeners);
  if (typeof tab !== 'undefined' && Object.keys(tab).length > 0) {
    querycB(tab);
  }
  chrome.runtime.onMessage.addListener(eventsListeners);
}
function onActivatedCb(info) {
  chrome.runtime.onMessage.removeListener(eventsListeners);
  chrome.tabs.get(info.tabId, function(tab) {
    if (
      typeof tab !== 'undefined' &&
      Object.keys(tab).length > 0 &&
      tab.url !== undefined
    ) {
      urls[info.tabId] = cxHelpers.extractRootDomain(tab.url);
      querycB(tab);
    }
  });
  chrome.runtime.onMessage.addListener(eventsListeners);
}

function querycB(tab) {
  const SEARCH_STRING = ['myetherwallet'];
  const ealBlacklisted = Object.assign({}, cxHelpers.blackListDomains['eal']),
    iosiroBlacklisted = Object.assign({}, cxHelpers.blackListDomains['iosiro']),
    phishfortBlacklisted = Object.assign(
      {},
      cxHelpers.blackListDomains['phishfort']
    ),
    mewBlacklisted = Object.assign({}, cxHelpers.blackListDomains['mew']),
    ealWhitelisted = Object.assign({}, cxHelpers.whiteListDomains['eal']),
    mewWhitelisted = Object.assign({}, cxHelpers.whiteListDomains['mew']);

  let allBlacklistedDomains = [];
  let allWhitelistedDomains = [];
  allBlacklistedDomains = ealBlacklisted.domains
    .concat(iosiroBlacklisted.domains)
    .concat(phishfortBlacklisted.domains)
    .concat(mewBlacklisted.domains);
  allWhitelistedDomains = mewWhitelisted.domains.concat(ealWhitelisted.domains);

  let urlRedirect;
  const foundWhitelist = allWhitelistedDomains.find(dom => {
    return dom === cxHelpers.extractRootDomain(tab.url);
  });
  const foundBlacklist = allBlacklistedDomains.find(dom => {
    return dom === cxHelpers.extractRootDomain(tab.url);
  });

  if (foundWhitelist === undefined) {
    if (
      foundBlacklist !== undefined ||
      cxHelpers.checkUrlSimilarity(tab.url, SEARCH_STRING)
    ) {
      urlRedirect = encodeURI(
        `https://www.myetherwallet.com/phishing.html?phishing-address=${tab.url}`
      );
      chrome.tabs.update(null, { url: urlRedirect });
    } else {
      // Injects web3
      chrome.tabs.sendMessage(tab.id, { event: CX_INJECT_WEB3 }, function() {});
    }
  } else {
    // Injects web3
    chrome.tabs.sendMessage(tab.id, { event: CX_INJECT_WEB3 }, function() {});
  }
}
