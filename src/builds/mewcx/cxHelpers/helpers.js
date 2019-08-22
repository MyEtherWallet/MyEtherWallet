import ealDarklist from '@/url-darklist/eal-blacklisted-domains.json';
import iosiroDarklist from '@/url-darklist/iosiro-blacklisted-domains.json';
import mewDarklist from '@/url-darklist/mew-blacklisted-domains.json';
import phishfortDarklist from '@/url-darklist/phishfort-blacklisted-domains.json';

import mewLightlist from '@/url-lightlist/mew-whitelisted-domains.json';
import ealLightlist from '@/url-lightlist/eal-whitelisted-domains.json';

const similarity = require('similarity');
const punycode = require('punycode');
const uniMap = require('unicode/category/Ll');
const homoglyphs = require('./homoglyphs');
const levenshtein = require('levenshtein');

const checkUrlSimilarity = (url, arr) => {
  const newUrl = transformHomoglyphs(parseUrl(url));
  if (isSimilar(newUrl, url, arr, 0.8) && !isNewBlacklist(url, arr)) {
    return true;
  }

  return false;
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

const blackListDomains = {
  eal: {
    domains: ealDarklist,
    identifier: 'eal'
  },
  iosiro: {
    domains: iosiroDarklist,
    identifier: 'iosiro'
  },
  phishfort: {
    domains: phishfortDarklist,
    identifier: 'phishfort'
  },
  mew: {
    domains: mewDarklist,
    identifier: 'mew'
  }
};

const whiteListDomains = {
  eal: {
    domains: mewLightlist,
    identifier: 'eal-whitelist'
  },
  mew: {
    domains: ealLightlist,
    identifier: 'mew-whitelist'
  }
};

const queryBuilder = function(request) {
  if (request.hasOwnProperty('meta') && Object.keys(request.meta).length > 0) {
    const arr = [];
    for (const i in request.meta) {
      if (request.meta.hasOwnProperty(i)) {
        arr.push(
          encodeURIComponent(i.replace('og:', '')) +
            '=' +
            encodeURIComponent(request.meta[i])
        );
      }
    }
    return arr.join('&');
  } else if (
    request.hasOwnProperty('tx') &&
    Object.keys(request.tx).length > 0
  ) {
    const arr = [];
    for (const i in request.tx) {
      if (request.tx.hasOwnProperty(i)) {
        arr.push(
          encodeURIComponent(i) + '=' + encodeURIComponent(request.tx[i])
        );
      }
    }
    return arr.join('&');
  }
  return '';
};

export default {
  checkUrlSimilarity,
  blackListDomains,
  whiteListDomains,
  queryBuilder
};
