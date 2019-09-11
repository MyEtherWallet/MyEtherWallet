import helpers from './helpers';
import { isAddress } from '@/helpers/addressUtils';
import { extractRootDomain } from './extractRootDomain';
import MiddleWare from '@/wallets/web3-provider/middleware';
import {
  mewCxFetchAccounts,
  mewCxSignTx,
  mewCxSignMsg,
  web3RpcRequest,
  mewCxSendSignedTx,
  web3Detected
} from './backgroundEvents';
import store from '@/store';
import {
  CX_INJECT_WEB3,
  CX_WEB3_DETECTED,
  WEB3_INJECT_SUCCESS
} from './cxEvents';
const chrome = window.chrome;
// Set default values on init
const networkChanger = items => {
  if (items.hasOwnProperty('defNetwork')) {
    const networkProps = JSON.parse(items['defNetwork']);
    const network = store.state.Networks[networkProps.key].find(
      actualNetwork => {
        return actualNetwork.url === networkProps.url;
      }
    );
    store.dispatch('switchNetwork', network).then(() => {
      store.dispatch('setWeb3Instance', network.url).then(() => {
        store.state.web3.eth.net.getId().then(res => {
          chrome.storage.sync.set({
            defChainID: store.state.network.type.chainID,
            defNetVersion: res
          });
        });
      });
    });
  } else {
    store.dispatch('setWeb3Instance');
    store.state.web3.eth.net.getId().then(res => {
      chrome.storage.sync.set({
        defChainID: store.state.network.type.chainID,
        defNetVersion: res,
        defNetwork: JSON.stringify({
          url: store.state.network.url,
          key: store.state.network.type.name
        })
      });
    });
  }
};
chrome.storage.sync.get(null, networkChanger);

// Listens for network changes and sets background store to match client store
chrome.storage.onChanged.addListener(items => {
  Object.keys(items).forEach(item => {
    if (isAddress(item)) {
      const currentNotifications = JSON.parse(
        localStorage.getItem('notifications')
      );
      currentNotifications[item] = [];
      localStorage.setItem(
        'notifications',
        JSON.stringify(currentNotifications)
      );
    }
    if (item === 'defNetwork') {
      const networkProps = JSON.parse(items['defNetwork'].newValue);
      const network = store.state.Networks[networkProps.key].find(
        actualNetwork => {
          return actualNetwork.url === networkProps.url;
        }
      );
      store.dispatch('switchNetwork', network).then(() => {
        store.dispatch('setWeb3Instance', network.url).then(() => {
          store.state.web3.eth.net.getId().then(res => {
            chrome.storage.sync.set({
              defChainID: store.state.network.type.chainID,
              defNetVersion: res
            });
          });
        });
      });
    }
  });
});
const urls = {};
// eslint-disable-next-line
let metamaskChecker;
const eventsListeners = (request, _, callback) => {
  if (request.event === CX_WEB3_DETECTED) {
    clearTimeout(metamaskChecker);
    metamaskChecker = setTimeout(function() {
      chrome.storage.remove('warned');
    }, 900000);
  }
  const obj = {
    event: request.event,
    payload: request.payload
  };

  const middleware = new MiddleWare();
  middleware.use(mewCxFetchAccounts);
  middleware.use(mewCxSignTx);
  middleware.use(mewCxSignMsg);
  middleware.use(mewCxSendSignedTx);
  middleware.use(web3RpcRequest);
  middleware.use(web3Detected);
  middleware.run(obj, callback);
  return true;
};
chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
  querycB(tabs);
});

chrome.tabs.onUpdated.addListener(onUpdatedCb);
chrome.tabs.onActivated.addListener(onActivatedCb);
chrome.tabs.onRemoved.addListener(onRemovedCb);

function onRemovedCb(id) {
  chrome.storage.sync.remove(urls[id], () => {});
  delete urls[id];
}

function onUpdatedCb(_, __, tab) {
  chrome.runtime.onMessage.removeListener(eventsListeners);
  if (typeof tab !== 'undefined' && Object.keys(tab).length > 0) {
    urls[tab.id] = extractRootDomain(tab.url);
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
      urls[info.tabId] = extractRootDomain(tab.url);
      querycB(tab);
    }
  });
  chrome.runtime.onMessage.addListener(eventsListeners);
}

function querycB(tab) {
  const SEARCH_STRING = ['myetherwallet'];
  const ealBlacklisted = Object.assign({}, helpers.blackListDomains['eal']),
    iosiroBlacklisted = Object.assign({}, helpers.blackListDomains['iosiro']),
    phishfortBlacklisted = Object.assign(
      {},
      helpers.blackListDomains['phishfort']
    ),
    mewBlacklisted = Object.assign({}, helpers.blackListDomains['mew']),
    ealWhitelisted = Object.assign({}, helpers.whiteListDomains['eal']),
    mewWhitelisted = Object.assign({}, helpers.whiteListDomains['mew']);

  let allBlacklistedDomains = [];
  let allWhitelistedDomains = [];
  allBlacklistedDomains = ealBlacklisted.domains
    .concat(iosiroBlacklisted.domains)
    .concat(phishfortBlacklisted.domains)
    .concat(mewBlacklisted.domains);
  allWhitelistedDomains = mewWhitelisted.domains.concat(ealWhitelisted.domains);

  let urlRedirect;
  const foundWhitelist = allWhitelistedDomains.find(dom => {
    return dom === extractRootDomain(tab.url);
  });
  const foundBlacklist = allBlacklistedDomains.find(dom => {
    return dom === extractRootDomain(tab.url);
  });

  if (foundWhitelist === undefined) {
    if (
      foundBlacklist !== undefined ||
      helpers.checkUrlSimilarity(tab.url, SEARCH_STRING)
    ) {
      urlRedirect = encodeURI(
        `https://www.myetherwallet.com/phishing.html?phishing-address=${tab.url}`
      );
      chrome.tabs.update(null, { url: urlRedirect });
    } else {
      // Injects web3
      chrome.tabs.sendMessage(tab.id, { event: CX_INJECT_WEB3 }, function() {
        store.state.web3.eth.net.getId().then(() => {
          chrome.tabs.sendMessage(tab.id, {
            event: WEB3_INJECT_SUCCESS.replace('{{id}}', 'internal') // triggers connect call
          });
        });
      });
    }
  } else {
    // Injects web3
    chrome.tabs.sendMessage(tab.id, { event: CX_INJECT_WEB3 }, function() {
      store.state.web3.eth.net.getId().then(() => {
        chrome.tabs.sendMessage(tab.id, {
          event: WEB3_INJECT_SUCCESS.replace('{{id}}', 'internal') // triggers connect call
        });
      });
    });
  }
}
