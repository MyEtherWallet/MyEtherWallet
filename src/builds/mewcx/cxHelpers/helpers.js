import ealDarklist from '@/_generated/url-darklist/eal-blacklisted-domains.json';
import mewDarklist from '@/_generated/url-darklist/mew-blacklisted-domains.json';
import phishfortDarklist from '@/_generated/url-darklist/phishfort-blacklisted-domains.json';

import mewLightlist from '@/_generated/url-lightlist/mew-whitelisted-domains.json';
import ealLightlist from '@/_generated/url-lightlist/eal-whitelisted-domains.json';

import Misc from '@/helpers/misc';

const similarity = require('similarity');
const punycode = require('punycode');
const uniMap = require('unicode/category/Ll');
const homoglyphs = require('./homoglyphs');
const levenshtein = require('levenshtein');

const checkUrlSimilarity = (url, arr) => {
  if (!url) return false;
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
            Misc.stripTags(encodeURIComponent(request.meta[i]))
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
          encodeURIComponent(i) +
            '=' +
            Misc.stripTags(encodeURIComponent(request.tx[i]))
        );
      }
    }
    return arr.join('&');
  }
  return '';
};

const varType = variable => {
  const isArray =
    variable && variable instanceof Array && typeof variable === 'object';
  const isObject =
    variable && variable instanceof Object && typeof variable === 'object';
  const isBoolean = variable && typeof x === 'boolean';
  const isNumber = variable && typeof x === 'number';
  const isString = variable && typeof x === 'string';

  if (isArray) return 'array';
  if (isObject) return 'object';
  if (isBoolean) return 'boolean';
  if (isNumber) return 'number';
  if (isString) return 'string';
};

const recursivePayloadStripper = val => {
  if (varType(val) === 'array') {
    return val.map(item => {
      if (varType(item) === 'object') {
        return recursivePayloadStripper(item);
      }
      return Misc.stripTags(item);
    });
  } else if (varType(val) === 'object') {
    const newObj = {};
    Object.keys(val).forEach(item => {
      if (varType(val[item]) === 'object' || varType(val[item]) === 'array') {
        newObj[item] = recursivePayloadStripper(val[item]);
      } else if (varType(val[item]) === 'string') {
        newObj[item] = Misc.stripTags(val[item]);
      } else {
        newObj[item] = val[item];
      }
    });
    return newObj;
  } else if (varType(val) === 'string') {
    return Misc.stripTags(val);
  }

  return val;
};

export default {
  checkUrlSimilarity,
  blackListDomains,
  whiteListDomains,
  queryBuilder,
  recursivePayloadStripper
};
