const punycode = require('punycode');
const uniMap = require('unicode/category/Ll');
const homoglyphs = require('./homoglyphs');
const similarity = require('similarity');
const levenshtein = require('levenshtein');
const chrome = window.chrome;
(function() {
  /* eslint no-undef: 0 no-console:0 */
  chrome.storage.sync.get(['eal-blacklisted-domains'], res => {
    res === null ? getDomains('eal') : checkIfDataIsRecent('eal');
  });
  chrome.storage.sync.get(['iosiro-blacklisted-domains'], res => {
    res === null ? getDomains('iosiro') : checkIfDataIsRecent('iosiro');
  });
  chrome.storage.sync.get(['phishfort-blacklisted-domains'], res => {
    res === null ? getDomains('phishfort') : checkIfDataIsRecent('phishfort');
  });

  chrome.storage.sync.get(['409h-whitelisted-domains'], res => {
    res === null ? getDomains('409h') : checkIfDataIsRecent('409h');
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
    const eal = {
      timestamp: 0,
      domains: [],
      format: 'plain',
      repo:
        'https://raw.githubusercontent.com/409H/EtherAddressLookup/master/blacklists/domains.json',
      identifer: 'eal'
    };

    const iosiro = {
      timestamp: 0,
      domains: [],
      format: 'plain',
      repo:
        'https://raw.githubusercontent.com/iosiro/counter_phishing_blacklist/master/blacklists/domains.json',
      identifer: 'iosiro'
    };

    const phishfort = {
      timestamp: 0,
      domains: [],
      format: 'plain',
      repo:
        'https://raw.githubusercontent.com/phishfort/phishfort-lists/master/blacklists/domains.json',
      identifer: 'phishfort'
    };

    const whitelistDef = {
      timestamp: 0,
      domains: [],
      format: 'plain',
      repo:
        'https://raw.githubusercontent.com/409H/EtherAddressLookup/master/whitelists/domains.json',
      identifer: 'whitelist'
    };
    const SEARCH_STRING = ['myetherwallet'];
    let ealBlacklisted = Object.assign({}, eal),
      iosiroBlacklisted = Object.assign({}, iosiro),
      phishfortBlacklisted = Object.assign({}, phishfort),
      whitelisted = Object.assign({}, whitelistDef);

    chrome.storage.sync.get(
      [
        'eal-blacklisted-domains',
        'iosiro-blacklisted-domains',
        'phishfort-blacklisted-domains',
        '409h-whitelisted-domains'
      ],
      res => {
        ealBlacklisted = res.hasOwnProperty('ealBlacklisted')
          ? JSON.parse(res['ealBlacklisted'])
          : eal;
        iosiroBlacklisted = res.hasOwnProperty('iosiroBlacklisted')
          ? JSON.parse(res['iosiroBlacklisted'])
          : iosiro;
        phishfortBlacklisted = res.hasOwnProperty('phishfortBlacklisted')
          ? JSON.parse(res['phishfortBlacklisted'])
          : phishfort;
        whitelisted = res.hasOwnProperty('whitelisted')
          ? JSON.parse(res['whitelisted'])
          : whitelistDef;
      }
    );

    const allDomains = ealBlacklisted.domains
      .concat(iosiroBlacklisted.domains)
      .concat(phishfortBlacklisted.domains);
    let urlRedirect;
    const foundWhitelist = whitelisted.domains.find(dom => {
      if (tabs.length > 0) {
        return dom === extractRootDomain(tabs[0].url);
      }
    });

    const foundBlacklist = allDomains.find(dom => {
      if (tabs.length > 0) {
        return dom === extractRootDomain(tabs[0].url);
      }
    });

    if (foundWhitelist === undefined) {
      if (
        foundBlacklist !== undefined ||
        checkUrlSimilarity(tabs[0].url, SEARCH_STRING)
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
  function extractHostname(url) {
    let hostname;
    if (url.indexOf('://') > -1) {
      hostname = url.split('/')[2];
    } else {
      hostname = url.split('/')[0];
    }

    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];

    return hostname;
  }

  function extractRootDomain(url) {
    let domain = extractHostname(url);
    const splitArr = domain.split('.');
    const arrLen = splitArr.length;

    if (arrLen > 2) {
      domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
      if (
        splitArr[arrLen - 2].length == 2 &&
        splitArr[arrLen - 1].length == 2
      ) {
        domain = splitArr[arrLen - 3] + '.' + domain;
      }
    }

    return domain.toLowerCase();
  }

  function checkIfDataIsRecent(str) {
    let dataObj = {};
    const storedName =
      str === 'eal' || str === 'iosiro' || str === 'phishfort'
        ? str + '-blacklisted-domains'
        : str + '-whitelisted-domains';
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
    console.log(str);
    const blackListDomains = {
      eal: {
        timestamp: 0,
        domains: [],
        format: 'plain',
        repo:
          'https://raw.githubusercontent.com/409H/EtherAddressLookup/master/blacklists/domains.json',
        identifer: 'eal'
      },
      iosiro: {
        timestamp: 0,
        domains: [],
        format: 'plain',
        repo:
          'https://raw.githubusercontent.com/iosiro/counter_phishing_blacklist/master/blacklists/domains.json',
        identifer: 'iosiro'
      },
      phishfort: {
        timestamp: 0,
        domains: [],
        format: 'plain',
        repo:
          'https://raw.githubusercontent.com/phishfort/phishfort-lists/master/blacklists/domains.json',
        identifer: 'phishfort'
      }
    };

    const whiteListDomains = {
      '409h': {
        timestamp: 0,
        domains: [],
        format: 'plain',
        repo:
          'https://raw.githubusercontent.com/409H/EtherAddressLookup/master/whitelists/domains.json',
        identifer: 'whitelist'
      }
    };

    let newName;

    if (
      str &&
      str !== '' &&
      (str === 'eal' || str === 'iosiro' || str == 'phishfort')
    ) {
      newName = str + '-blacklisted-domains';
      setInStorage(blackListDomains[str], newName);
    } else if (
      str &&
      str !== '' &&
      (str !== 'eal' || str !== 'iosiro' || str != 'phishfort')
    ) {
      newName = str + '-whitelisted-domains';
      setInStorage(whiteListDomains[str], newName);
    } else {
      Object.keys(blackListDomains).forEach(src => {
        newName = src + '-blacklisted-domains';
        setInStorage(blackListDomains[src], newName);
      });

      Object.keys(whiteListDomains).forEach(src => {
        newName = src + '-whitelisted-domains';
        setInStorage(whiteListDomains[src], newName);
      });
    }
  }

  function setInStorage(src, storageName) {
    const obj = {};
    obj[storageName] = JSON.stringify(src);
    getDomainsFromSource(src).then(domains => {
      src.timestamp = Math.floor(Date.now() / 1000);
      src.domains = domains;
      chrome.storage.sync.set(obj, console.log);
    });
  }

  async function getDomainsFromSource(objBlacklist) {
    try {
      const objResponse = await fetch(objBlacklist.repo);
      return objResponse.json();
    } catch (objError) {
      console.log('Failed to get blacklist for ' + objBlacklist.repo, objError);
    }
  }

  function checkUrlSimilarity(url, arr) {
    const newUrl = transformHomoglyphs(parseUrl(url));
    if (isSimilar(newUrl, url, arr, 0.8) && !isNewBlacklist(url, arr)) {
      console.log('.....');
      return true;
    }

    return false;
  }

  function isNewBlacklist(url, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === url) {
        return false;
      }
    }
    return true;
  }

  function isSimilar(newUrl, comparedToUrl, arr, percent) {
    for (let i = 0; i < arr.length; i++) {
      const sim = similarity(arr[i], newUrl);
      if (sim >= percent || !levenshteinCheck(comparedToUrl, arr[i])) {
        return true;
      }
    }

    return false;
  }

  function parseUrl(url) {
    try {
      return punycode.toUnicode(url);
    } catch (e) {
      return url;
    }
  }

  function levenshteinCheck(url, validString) {
    const distance = new levenshtein(url, validString).distance;
    const holisticStd = 3.639774978064392;
    const holisticLimit = 4 + 1 * holisticStd;
    return distance > 0 && distance < holisticLimit ? true : false;
  }

  function transformHomoglyphs(str) {
    let asciiStr = '';
    for (const char of str) {
      const uInfo = uniMap[char.charCodeAt(0)];

      if (uInfo && uInfo.mapping) {
        const maps = uInfo.mapping.split(' ');
        asciiStr += String.fromCharCode(parseInt('0x') + maps[0]);
      } else {
        asciiStr += homoglyphs[char] ? homoglyphs[char] : char;
      }
    }

    return asciiStr;
  }
})();
