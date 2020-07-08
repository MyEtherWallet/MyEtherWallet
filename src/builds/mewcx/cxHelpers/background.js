import helpers from './helpers';
import { isAddress, toChecksumAddress } from '@/helpers/addressUtils';
import { extractRootDomain } from './extractRootDomain';
import MiddleWare from '@/wallets/web3-provider/middleware';
import localStorage from 'store';
import Networks from '@/networks';
import {
  mewCxFetchAccounts,
  mewCxSignTx,
  mewCxSignMsg,
  web3RpcRequest,
  mewCxSendSignedTx,
  web3Detected,
  web3Subscription,
  web3Unsubscribe,
  web3QueryGasPrice,
  web3GetTxCount,
  web3GetGas,
  web3SignTx,
  web3SignMsg
} from './backgroundEvents';
import store from '@/store';
import {
  CX_INJECT_WEB3,
  CX_WEB3_DETECTED,
  WEB3_INJECT_SUCCESS
} from './cxEvents';
import utils from 'web3-utils';
const chrome = window.chrome;
chrome.tabs.onUpdated.addListener(onUpdatedCb);
chrome.tabs.onActivated.addListener(onActivatedCb);
chrome.tabs.onRemoved.addListener(onRemovedCb);
chrome.runtime.onInstalled.addListener(onInstalledCb);
chrome.runtime.onStartup.addListener(onStartupCb);
chrome.runtime.onMessage.addListener(eventsListeners);

const setupState = obj => {
  const stateVal = [
    'accounts',
    'defChainID',
    'defNetwork',
    'favorites',
    'sites'
  ];
  const newState = {};
  stateVal.forEach(item => {
    if (obj[item]) {
      newState[item] =
        item !== 'defChainID' ? JSON.parse(obj[item]) : obj[item];
    }
  });

  store.dispatch('mewcx/setState', newState).then(() => {
    const defNetwork = newState['defNetwork']
      ? Networks[newState['defNetwork'].key][0]
      : Networks['ETH'][0];
    store.dispatch('main/switchNetwork', defNetwork).then(() => {
      store.dispatch('main/setWeb3Instance', defNetwork);
    });
  });
  const notifications = localStorage.get('notifications');

  const accounts = obj['accounts'] ? JSON.parse(obj['accounts']) : [];
  accounts.forEach(itm => {
    if (!notifications[itm.address]) {
      notifications[itm.address] = [];
    }
  });

  localStorage.set('notifications', notifications);
};
chrome.storage.sync.get(null, setupState);

chrome.storage.onChanged.addListener(() => {
  chrome.storage.sync.get(null, setupState);
});

const urls = {};
// eslint-disable-next-line
let metamaskChecker;
const eventsListeners = (request, _, callback) => {
  if (request.event === CX_WEB3_DETECTED) {
    clearTimeout(metamaskChecker);
    metamaskChecker = setTimeout(() => {
      chrome.storage.sync.remove('warned');
    }, 180000); // Clear var in 3 minutes
  }

  const payload = utils._.mapObject(
    Object.assign({}, request.payload),
    function (val) {
      return helpers.recursivePayloadStripper(val);
    }
  );

  const obj = {
    event: request.event,
    payload: payload
  };

  const middleware = new MiddleWare();
  middleware.use(mewCxFetchAccounts);
  middleware.use(mewCxSignTx);
  middleware.use(mewCxSignMsg);
  middleware.use(mewCxSendSignedTx);
  middleware.use(web3RpcRequest);
  middleware.use(web3Detected);
  middleware.use(web3Subscription);
  middleware.use(web3Unsubscribe);
  middleware.use(web3QueryGasPrice);
  middleware.use(web3GetTxCount);
  middleware.use(web3GetGas);
  middleware.use(web3SignTx);
  middleware.use(web3SignMsg);
  middleware.run(obj, callback);
  return true;
};
chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
  querycB(tabs);
});

function onRemovedCb(id) {
  if (urls[id]) {
    chrome.storage.sync.remove(urls[id], () => {});
    delete urls[id];
  }
}
const isChromeUrl = url => {
  if (!url) return true;
  return url.startsWith('chrome://') || url.startsWith('chrome-extension://');
};
function onUpdatedCb(_, __, tab) {
  if (
    typeof tab !== 'undefined' &&
    Object.keys(tab).length > 0 &&
    !isChromeUrl(tab.url)
  ) {
    urls[tab.id] = extractRootDomain(tab.url);
    querycB(tab);
  }
}
function onActivatedCb(info) {
  chrome.tabs.get(info.tabId, function (tab) {
    if (
      typeof tab !== 'undefined' &&
      Object.keys(tab).length > 0 &&
      !isChromeUrl(tab.url)
    ) {
      urls[info.tabId] = extractRootDomain(tab.url);
      querycB(tab);
    }
  });
}

function onInstalledCb() {
  chrome.runtime.onMessage.removeListener(eventsListeners);
  chrome.runtime.onMessage.addListener(eventsListeners);
  migrateAddresses();
}

function migrateAddresses() {
  chrome.storage.sync.get(null, obj => {
    if (!obj['version'] || obj['version'] !== '5.7.1') {
      const foundAccounts = Object.keys(obj).filter(item => {
        if (isAddress(item)) {
          return item;
        }
      });

      const favorites = JSON.parse(obj['favorites']);

      if (foundAccounts.length > 0) {
        foundAccounts.forEach(item => {
          const newObj = {};
          const value = JSON.parse(obj[item]);
          if (favorites.length > 0) {
            const isFavorited = favorites.find(fav => {
              return toChecksumAddress(fav.address) === toChecksumAddress(item);
            });

            newObj['favorited'] = isFavorited ? true : false;
          } else {
            newObj['favorited'] = false;
          }
          newObj['address'] = toChecksumAddress(item);
          newObj['priv'] = value['priv'];
          newObj['nick'] = value['nick'];
          newObj['type'] = value['type'];
          store.dispatch('mewcx/addAccount', newObj);
        });
      }
      chrome.storage.sync.set({ version: '5.7.1', sites: '[]' }, () => {});
    }
  });
}

function onStartupCb() {
  onInstalledCb();
}

function querycB(tab) {
  if (tab.url) {
    const SEARCH_STRING = ['myetherwallet'];
    const ealBlacklisted = Object.assign({}, helpers.blackListDomains['eal']),
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
      .concat(phishfortBlacklisted.domains)
      .concat(mewBlacklisted.domains);
    allWhitelistedDomains = mewWhitelisted.domains.concat(
      ealWhitelisted.domains
    );

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
          `https://www.myetherwallet.com/phishing-catcher?phishing-address=${tab.url}`
        );
        chrome.tabs.update(null, { url: urlRedirect });
      } else {
        // Injects web3
        chrome.tabs.sendMessage(tab.id, { event: CX_INJECT_WEB3 }, function () {
          chrome.tabs.sendMessage(tab.id, {
            event: WEB3_INJECT_SUCCESS.replace('{{id}}', 'internal') // triggers connect call
          });
        });
      }
    } else {
      // Injects web3
      chrome.tabs.sendMessage(tab.id, { event: CX_INJECT_WEB3 }, function () {
        chrome.tabs.sendMessage(tab.id, {
          event: WEB3_INJECT_SUCCESS.replace('{{id}}', 'internal') // triggers connect call
        });
      });
    }
  }
}
