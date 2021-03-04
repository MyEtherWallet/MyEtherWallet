import { v4 as uuid } from 'uuid';
import { Toast } from '@/helpers';

const createProxy = (valueObject = {}, defaultValue = 42) => {
  const handler = function (defaultValue) {
    return {
      get: function (target, name) {
        return target.hasOwnProperty(name) ? target[name] : defaultValue;
      },
      set: function (obj, prop, value) {
        obj[prop] = value;
        return true;
      }
    };
  };

  return new Proxy(valueObject, handler(defaultValue));
};

const mapToObject = map => {
  const obj = {};
  for (const prop of map) {
    obj[prop[0]] = prop[1];
  }
  return obj;
};

const objectToMap = obj => {
  return new Map(Object.entries(obj));
};

function isValidEntry(value) {
  return (
    value !== '' && value !== null && +value > 0 && Number.isFinite(+value)
  );
}

function checkInvalidOrMissingValue(value, to) {
  if (to) {
    if (!isValidEntry(value)) {
      return 0;
    }
    return value;
  }
  if (!isValidEntry(value)) {
    return 1;
  }
  return value;
}

const getTimeRemaining = (timestamp, validFor = 600) => {
  return (
    validFor - parseInt((new Date().getTime() - Date.parse(timestamp)) / 1000)
  );
};

const getTimeRemainingString = (timestamp, validFor = 600) => {
  const timeRemaining = getTimeRemaining(timestamp, validFor);
  if (timeRemaining < 0) {
    return 'expired';
  }
  const seconds = Math.floor(timeRemaining % 60);
  const minutes = Math.floor((timeRemaining / 60) % 60);
  return seconds >= 10 ? `${minutes}:${seconds}` : `${minutes}:0${seconds}`;
};

function buildPayload(method, data) {
  return {
    jsonrpc: '2.0',
    method: method,
    params: data,
    id: uuid()
  };
}

function stringEqual(strA, strB) {
  let mismatch = 0;
  for (let i = 0; i < strA.length; ++i) {
    mismatch |= strA.charCodeAt(i) ^ strB.charCodeAt(i);
  }
  return mismatch === 0;
}

const isJson = str => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    try {
      const asStr = JSON.stringify(str);
      JSON.parse(asStr);
      return true;
    } catch (e) {
      return false;
    }
  }
};

const checkErrorJson = (results, source) => {
  if (typeof results.error == 'string') {
    if (results.error === 'Error retrieving trade, try a different dex') {
      throw Error('Error retrieving trade, try a different dex');
    }
  }
  if (
    results.error.message.includes('gas required exceeds allowance') &&
    source === 'eth_estimateGasList'
  ) {
    throw Error('Please try a different dex. Problem calculating gas Limit.');
  }
  if (isJson(results.error.message)) {
    throw Error(JSON.stringify(results.error.message));
  }
  throw Error(results.error.message);
};

const handleOrThrow = (e, source) => {
  if (source === 'suppress') {
    return;
  } else if (source === 'handle') {
    Toast.responseHandler('Swap Error', 1, true);
  } else if (source) {
    throw Error('abort');
  }
  // typeErrors
  if (e instanceof TypeError) {
    if (e.message === 'Failed to fetch') {
      return;
    }
    throw e;
  } else if (e.message) {
    if (
      e.message.includes('This order can not be placed') &&
      e.message.includes('bity.com')
    ) {
      Toast.responseHandler(e.message, 3);
      return;
    } else if (
      e.message.includes('Error retrieving trade, try a different dex') ||
      e.message.includes(
        'Please try a different dex. Problem calculating gas Limit.'
      )
    ) {
      Toast.responseHandler(e.message, 3);
      return;
    } else if (e.message.includes('insufficient funds for transfer')) {
      Toast.responseHandler(e.message, 3);
      return;
    }
  }
  throw e;
};

export {
  isJson,
  mapToObject,
  objectToMap,
  stringEqual,
  getTimeRemaining,
  getTimeRemainingString,
  buildPayload,
  isValidEntry,
  checkInvalidOrMissingValue,
  handleOrThrow,
  checkErrorJson,
  createProxy
};
