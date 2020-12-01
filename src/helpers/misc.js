import normalise from '@/helpers/normalise';
import nodeList from '@/networks';
import { isAddress } from './addressUtils';
import url from 'url';
import utils from 'web3-utils';
import store from '@/store';
import { isHexString, toBuffer as utilsToBuffer } from 'ethereumjs-util';
import { uint, address, string, bytes, bool, int } from './solidityTypes';
import xss from 'xss';
import { MEW_CX } from '@/builds/configs/types';

const toBuffer = v => {
  if (isHexString(v)) {
    return utilsToBuffer(v);
  }
  return Buffer.from(v);
};
const capitalize = value => {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.substr(1, value.length);
};
/* Accepts string, returns boolean */
const isJson = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
};

const getService = parsableUrl => {
  const parsedUrl = url.parse(parsableUrl).hostname;
  const splitUrl = parsedUrl.split('.');
  if (splitUrl.length > 2)
    // eslint-disable-next-line
    return capitalize(`${splitUrl[1]}.${splitUrl[2]}`);
  return capitalize(splitUrl.join('.'));
};

const doesExist = val => val !== undefined && val !== null;

const padLeftEven = hex => {
  hex = hex.length % 2 !== 0 ? '0' + hex : hex;
  return hex;
};

const isInt = num => {
  try {
    utils.toBN(num);
    return true;
  } catch (e) {
    return false;
  }
};

const formatDate = date => {
  const days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
  const day = days[new Date(date).getDay()];
  const dateString = new Date(date).toLocaleDateString();
  const regExp = /\(([^)]+)\)/;
  const timeString = new Date(date).toTimeString();
  const lengthMinus1 = timeString.length - 1;
  const stripTimezone = timeString
    .slice(timeString.indexOf('(') + 1, lengthMinus1)
    .split(' ')
    .map(item => {
      return item[0];
    })
    .join('');
  const removedTimezone = timeString.replace(regExp, '');
  const removeEndNumber = removedTimezone.slice(0, 12);
  const GMTtime = removeEndNumber.replace(removeEndNumber.slice(5, 8), '');
  const localTime = new Date(date).toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit'
  });
  return `${day}. ${dateString} ${GMTtime} - ${localTime} ${stripTimezone}`;
};
const isValidETHAddress = address => {
  return isAddress(address);
};
const isValidENSorEtherAddress = address => {
  return isValidETHAddress(address) || isValidENSAddress(address);
};
const isValidENSAddress = function (address) {
  try {
    address = normalise(address);
  } catch (e) {
    return false;
  }
  return address.lastIndexOf('.') != -1;
};

const sanitizeHex = hex => {
  hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex;
  if (hex == '') return '0x';
  return '0x' + padLeftEven(hex);
};

const scrollToTop = scrollDuration => {
  const scrollHeight = window.scrollY,
    scrollStep = Math.PI / (scrollDuration / 15),
    cosParameter = scrollHeight / 2;

  let scrollCount = 0;
  let scrollMargin;
  const scrollInterval = setInterval(function () {
    if (window.scrollY != 0) {
      scrollCount = scrollCount + 1;
      scrollMargin =
        cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
      window.scrollTo(0, scrollHeight - scrollMargin);
    } else clearInterval(scrollInterval);
  }, 15);
};

const validateHexString = str => {
  if (str === '') return true;
  str =
    str.substring(0, 2) === '0x'
      ? str.substring(2).toUpperCase()
      : str.toUpperCase();
  return utils.isHex(str);
};

const reorderNetworks = () => {
  const oldObject = Object.assign({}, nodeList);
  delete oldObject['ETH'];
  delete oldObject['RIN'];
  delete oldObject['ROP'];
  const newObject = Object.assign(
    {},
    {
      ETH: nodeList['ETH'],
      ROP: nodeList['ROP'],
      RIN: nodeList['RIN'],
      ...oldObject
    }
  );
  for (const net in newObject) {
    if (newObject[net].length === 0) delete newObject[net];
  }
  return newObject;
};

const solidityType = inputType => {
  if (!inputType) inputType = '';
  if (inputType.includes('[]')) {
    return { type: 'string', solidityType: `${inputType}` };
  }
  if (inputType.includes(uint)) return { type: 'number', solidityType: uint };
  if (inputType.includes(address))
    return { type: 'text', solidityType: address };
  if (inputType.includes(string)) return { type: 'text', solidityType: string };
  if (inputType.includes(bytes)) return { type: 'text', solidityType: bytes };
  if (inputType.includes(bool)) return { type: 'radio', solidityType: bool };
  return { type: 'text', solidityType: string };
};

const isDarklisted = addr => {
  const storedDarklist = store.state.main.darklist.data;
  const darklisted =
    storedDarklist > 0
      ? storedDarklist.findIndex(item => {
          return (
            utils.toChecksumAddress(item.address.toLowerCase()) ===
            utils.toChecksumAddress(addr.toLowerCase())
          );
        })
      : -1;
  const errMsg =
    darklisted === -1 ? '' : store.state.main.darklist.data[darklisted].comment;
  const errObject = {
    error: darklisted === -1 ? false : true,
    msg: errMsg
  };
  return errObject;
};

const stringToArray = str => {
  return str.replace(/[^a-zA-Z0-9_,]+/g, '').split(',');
};

const isContractArgValid = (value, solidityType) => {
  if (!value && typeof value !== 'boolean') value = '';
  if (solidityType.includes('[]')) {
    const parsedValue = Array.isArray(value) ? value : stringToArray(value);
    const type = solidityType.replace('[]', '');
    for (const parsedItem of parsedValue) {
      if (!isContractArgValid(parsedItem, type)) return false;
    }
    return true;
  }
  if (solidityType.includes(uint) || solidityType.includes(int))
    return value !== '' && !isNaN(value) && isInt(value);
  if (solidityType === address) return isAddress(value);
  if (solidityType === string) return true;
  if (solidityType.includes(bytes))
    return value.substr(0, 2) === '0x' && validateHexString(value);
  if (solidityType === bool)
    return typeof value === typeof true || typeof value === typeof false;
  return false;
};

const stripTags = content => {
  const insertToDom = new DOMParser().parseFromString(content, 'text/html');
  const textContent =
    insertToDom && insertToDom.body
      ? insertToDom.body.textContent.replace(/(<([^>]+)>)/gi, '')
      : '';
  const string = xss(textContent, {
    whitelist: [],
    stripIgnoreTag: true,
    stripIgnoreTagBody: '*'
  });
  return string;
};

const isMewCx = () => {
  return BUILD_TYPE === MEW_CX;
};

const toDollar = val => {
  return `${val
    .toLocaleString('en-GB', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      currencyDisplay: 'symbol'
    })
    .replace('US', '')
    .replace('$', '$ ')}`;
};

const downloadMEWWalletApp = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isWindows = /windows phone/i.test(userAgent);
  const isAndroid = /android/i.test(userAgent);
  const isApple = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  // const isSamsung = userAgent.match(
  //   /SAMSUNG|Samsung|SGH-[I|N|T]|GT-[I|N]|SM-[A|N|P|T|Z]|SHV-E|SCH-[I|J|R|S]|SPH-L/i
  // );

  if (isWindows) {
    return;
  } else if (isAndroid) {
    window.location.href =
      'https://play.google.com/store/apps/details?id=com.myetherwallet.mewwallet';
  } else if (isApple) {
    window.location.href = 'https://itunes.apple.com/app/id1464614025';
  } else {
    window.open('https://www.mewwallet.com/', '_blank');
  }
};

export default {
  isJson,
  doesExist,
  padLeftEven,
  formatDate,
  isValidENSorEtherAddress,
  isValidENSAddress,
  isValidETHAddress,
  sanitizeHex,
  validateHexString,
  scrollToTop,
  reorderNetworks,
  isDarklisted,
  solidityType,
  isInt,
  capitalize,
  getService,
  stringToArray,
  isContractArgValid,
  stripTags,
  isMewCx,
  toBuffer,
  toDollar,
  downloadMEWWalletApp
};
