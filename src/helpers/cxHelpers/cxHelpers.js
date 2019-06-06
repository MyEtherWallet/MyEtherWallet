const similarity = require('similarity');
const punycode = require('punycode');
const uniMap = require('unicode/category/Ll');
const homoglyphs = require('./homoglyphs');
const levenshtein = require('levenshtein');

const getDomainsFromSource = async obj => {
  try {
    const objResponse = await fetch(obj.repo);
    return objResponse.json();
  } catch (objError) {
    console.error(objError);
  }
};

const checkUrlSimilarity = (url, arr) => {
  const newUrl = transformHomoglyphs(parseUrl(url));
  if (isSimilar(newUrl, url, arr, 0.8) && !isNewBlacklist(url, arr)) {
    return true;
  }

  return false;
};

const parseMewFormat = res => {
  return res.map(item => {
    return item.id;
  });
};

const isNewBlacklist = (url, arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === url) {
      return false;
    }
  }
  return true;
};

const isSimilar = (newUrl, comparedToUrl, arr, percent) => {
  for (let i = 0; i < arr.length; i++) {
    const sim = similarity(arr[i], newUrl);
    if (sim >= percent || !levenshteinCheck(comparedToUrl, arr[i])) {
      return true;
    }
  }

  return false;
};

const parseUrl = url => {
  try {
    return punycode.toUnicode(url);
  } catch (e) {
    return url;
  }
};

const levenshteinCheck = (url, validString) => {
  const distance = new levenshtein(url, validString).distance;
  const holisticStd = 3.639774978064392;
  const holisticLimit = 4 + 1 * holisticStd;
  return distance > 0 && distance < holisticLimit ? true : false;
};

const transformHomoglyphs = str => {
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
};

const extractHostname = url => {
  let hostname;
  if (url.indexOf('://') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];

  return hostname;
};

const extractRootDomain = url => {
  let domain = extractHostname(url);
  const splitArr = domain.split('.');
  const arrLen = splitArr.length;

  if (arrLen > 2) {
    domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
      domain = splitArr[arrLen - 3] + '.' + domain;
    }
  }

  return domain.toLowerCase();
};

const blackListDomains = {
  eal: {
    domains: [],
    repo:
      'https://raw.githubusercontent.com/409H/EtherAddressLookup/master/blacklists/domains.json',
    identifier: 'eal'
  },
  iosiro: {
    domains: [],
    repo:
      'https://raw.githubusercontent.com/iosiro/counter_phishing_blacklist/master/blacklists/domains.json',
    identifier: 'iosiro'
  },
  phishfort: {
    domains: [],
    repo:
      'https://raw.githubusercontent.com/phishfort/phishfort-lists/master/blacklists/domains.json',
    identifier: 'phishfort'
  },
  mew: {
    domains: [],
    repo:
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/urls/urls-darklist.json',
    identifier: 'mew'
  }
};

const whiteListDomains = {
  eal: {
    domains: [],
    repo:
      'https://raw.githubusercontent.com/409H/EtherAddressLookup/master/whitelists/domains.json',
    identifier: 'eal-whitelist'
  },
  mew: {
    domains: [],
    repo:
      'https://raw.githubusercontent.com/MyEtherWallet/ethereum-lists/master/src/urls/urls-lightlist.json',
    identifier: 'mew-whitelist'
  }
};

const hosts = [
  'eal-blacklisted-domains',
  'iosiro-blacklisted-domains',
  'phishfort-blacklisted-domains',
  'mew-blacklisted-domains',
  'eal-whitelisted-domains',
  'mew-whitelisted-domains'
];

export default {
  getDomainsFromSource,
  checkUrlSimilarity,
  extractRootDomain,
  blackListDomains,
  whiteListDomains,
  hosts,
  parseMewFormat
};
