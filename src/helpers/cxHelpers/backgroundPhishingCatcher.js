import cxHelpers from './cxHelpers';
const chrome = window.chrome;
(function() {
  /* eslint no-undef: 0 no-console:0 */
  cxHelpers.hosts.forEach(item => {
    const nameString = item.replace('-domains', '');
    chrome.storage.sync.get([item], res => {
      res.hasOwnProperty('domains')
        ? checkIfDataIsRecent(nameString)
        : getDomains(nameString);
    });
  });

  setInterval(function() {
    getDomains();
  }, 180000);

  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
    querycB(tabs);
  });

  chrome.tabs.onActivated.addListener(cb);
  chrome.tabs.onUpdated.addListener(cb);

  function cb() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(
      tabs
    ) {
      querycB(tabs);
    });
  }

  function querycB(tabs) {
    const SEARCH_STRING = ['myetherwallet'];
    let ealBlacklisted = Object.assign({}, cxHelpers.blackListDomains['eal']),
      iosiroBlacklisted = Object.assign(
        {},
        cxHelpers.blackListDomains['iosiro']
      ),
      phishfortBlacklisted = Object.assign(
        {},
        cxHelpers.blackListDomains['phishfort']
      ),
      mewBlacklisted = Object.assign({}, cxHelpers.blackListDomains['mew']),
      ealWhitelisted = Object.assign({}, cxHelpers.whiteListDomains['eal']),
      mewWhitelisted = Object.assign({}, cxHelpers.whiteListDomains['mew']);

    chrome.storage.sync.get(cxHelpers.hosts, res => {
      ealBlacklisted = res.hasOwnProperty('ealBlacklisted')
        ? JSON.parse(res['ealBlacklisted'])
        : cxHelpers.blackListDomains['eal'];
      iosiroBlacklisted = res.hasOwnProperty('iosiroBlacklisted')
        ? JSON.parse(res['iosiroBlacklisted'])
        : cxHelpers.blackListDomains['iosiro'];
      phishfortBlacklisted = res.hasOwnProperty('phishfortBlacklisted')
        ? JSON.parse(res['phishfortBlacklisted'])
        : cxHelpers.blackListDomains['phishfort'];
      mewBlacklisted = res.hasOwnProperty('phishfortBlacklisted')
        ? JSON.parse(res['mewBlacklisted'])
        : cxHelpers.blackListDomains['mew'];
      ealWhitelisted = res.hasOwnProperty('whitelisted')
        ? JSON.parse(res['whitelisted'])
        : cxHelpers.whiteListDomains['eal'];
      mewWhitelisted = res.hasOwnProperty('whitelisted')
        ? JSON.parse(res['whitelisted'])
        : cxHelpers.whiteListDomains['mew'];
    });

    const allBlacklistedDomains = ealBlacklisted.domains
      .concat(iosiroBlacklisted.domains)
      .concat(phishfortBlacklisted.domains)
      .concat(mewBlacklisted.domains);
    const allWhitelistedDomains = mewWhitelisted.domains.concat(
      ealWhitelisted.domains
    );

    let urlRedirect;
    const foundWhitelist = allWhitelistedDomains.domains.find(dom => {
      if (tabs.length > 0) {
        return dom === cxHelpers.extractRootDomain(tabs[0].url);
      }
    });
    const foundBlacklist = allBlacklistedDomains.find(dom => {
      if (tabs.length > 0) {
        return dom === cxHelpers.extractRootDomain(tabs[0].url);
      }
    });

    if (foundWhitelist === undefined) {
      if (
        foundBlacklist !== undefined ||
        cxHelpers.checkUrlSimilarity(tabs[0].url, SEARCH_STRING)
      ) {
        urlRedirect = encodeURI(
          `https://www.myetherwallet.com/phishing.html?phishing-address=${
            tabs[0].url
          }`
        );
        chrome.tabs.update(null, { url: urlRedirect });
      }
    }
  }

  function checkIfDataIsRecent(str) {
    let dataObj = {};
    const storedName = `${str}-domains`;
    chrome.storage.sync.get([storedName], res => {
      const isEmpty = Object.keys(res).length === 0;
      dataObj = !isEmpty ? JSON.parse(res) : res;
    });

    if (
      (dataObj.hasOwnProperty('timestamp') && dataObj.timestamp === 0) ||
      Math.floor(Date.now() / 1000) - dataObj.timestamp > 300
    ) {
      return getDomains(str);
    }
    return dataObj;
  }

  function getDomains(str) {
    if (str) {
      const newName = `${str}-domains`;
      if (str.includes('whitelisted')) {
        setInStorage(
          cxHelpers.whiteListDomains[str.replace('-whitelisted', '')],
          newName
        );
      }

      if (str.includes('blacklisted')) {
        setInStorage(
          cxHelpers.blackListDomains[str.replace('-blacklisted', '')],
          newName
        );
      }
    } else {
      Object.keys(cxHelpers.blackListDomains).forEach(src => {
        setInStorage(
          cxHelpers.blackListDomains[src],
          src + '-blacklisted-domains'
        );
      });

      Object.keys(cxHelpers.whiteListDomains).forEach(src => {
        setInStorage(
          cxHelpers.whiteListDomains[src],
          src + '-whitelisted-domains'
        );
      });
    }
  }

  function setInStorage(src, storageName) {
    const storObj = {};
    cxHelpers.getDomainsFromSource(src).then(domains => {
      if (src.identifier.includes('mew')) {
        src.domains = cxHelpers.parseMewFormat(domains);
      } else {
        src.domains = domains;
      }
      src.timestamp = Math.floor(Date.now() / 1000);
      storObj[storageName] = JSON.stringify(src);
      chrome.storage.sync.set(storObj, console.log);
    });
  }
})();
