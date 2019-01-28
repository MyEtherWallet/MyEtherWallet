import normalise from '@/helpers/normalise';
import nodeList from '@/networks';
import { isAddress } from './addressUtils';
/* Accepts string, returns boolean */
const isJson = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
};

const doesExist = val => val !== undefined && val !== null;

const padLeftEven = hex => {
  hex = hex.length % 2 !== 0 ? '0' + hex : hex;
  return hex;
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
const isValidENSAddress = function(address) {
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
  const scrollInterval = setInterval(function() {
    if (window.scrollY != 0) {
      scrollCount = scrollCount + 1;
      scrollMargin =
        cosParameter - cosParameter * Math.cos(scrollCount * scrollStep);
      window.scrollTo(0, scrollHeight - scrollMargin);
    } else clearInterval(scrollInterval);
  }, 15);
};

const validateHexString = str => {
  if (str == '') return true;
  str =
    str.substring(0, 2) == '0x'
      ? str.substring(2).toUpperCase()
      : str.toUpperCase();
  const re = /^[0-9A-F]+$/g;
  return re.test(str);
};

const reorderNetworks = () => {
  const oldObject = Object.assign({}, nodeList);
  delete oldObject['ETH'];
  delete oldObject['RIN'];
  delete oldObject['ROP'];
  return Object.assign(
    {},
    {
      ETH: nodeList['ETH'],
      ROP: nodeList['ROP'],
      RIN: nodeList['RIN'],
      ...oldObject
    }
  );
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
  reorderNetworks
};
