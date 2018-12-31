import {
  INVESTIGATE_FAILURE_KEY,
  type,
  notificationType,
  notificationStatuses,
  swapOnlyStatuses,
  swapIndexes,
  txIndexes
} from './config';

import {
  formatSwap,
  formatSwapError,
  formatSwapErrorUpdate,
  formatSwapReciept,
  formatTransactionError,
  formatTransactionErrorUpdate,
  formatTransactionHash,
  formatTransactionReciept,
  identifyErrors
} from './formatters';
import { getNotificationIndex, getSwapEntryIndex } from './utils';

const transactionHash = (notifArray, val, network) => {
  notifArray.push(formatTransactionHash(val, network));
  return notifArray;
};

const transactionReceipt = (notifArray, val, network) => {
  const idx = notifArray.findIndex(entry => getNotificationIndex(entry, val));
  notifArray[idx] = formatTransactionReciept(notifArray[idx], val, network);
  return notifArray;
};

const transactionError = (notifArray, val, network) => {
  const idx = notifArray.findIndex(entry => getNotificationIndex(entry, val));
  if (idx >= 0 && !val[txIndexes.response].message) {
    notifArray[idx] = formatTransactionErrorUpdate(notifArray[idx]);
    return notifArray;
  }
  notifArray.push(formatTransactionError(val, network));
  return notifArray;
};

const swapHash = (notifArray, val, network) => {
  notifArray.push(formatSwap(val, network));
  return notifArray;
};

const swapReceipt = async (notifArray, val) => {
  const idx = notifArray.findIndex(entry => getSwapEntryIndex(entry, val));
  notifArray[idx] = formatSwapReciept(notifArray[idx], val);
  return notifArray;
};

// For swaps not using the ethereum network
const swapOrder = (notifArray, val, network) => {
  notifArray.push(formatSwap(val, network));
  return notifArray;
};

const swapError = (notifArray, val, network) => {
  const idx = notifArray.findIndex(entry => getSwapEntryIndex(entry, val));
  identifyErrors(val[swapIndexes.response]);
  if (!/known transaction/.test(val[swapIndexes.response]).message) {
    if (idx >= 0) {
      notifArray[idx] = formatSwapErrorUpdate(notifArray[idx]);
      return notifArray;
    }
    notifArray.push(formatSwapError(val, network));
    return notifArray;
  }
  notifArray.push(formatSwapError(val, network));
  return notifArray;
};

const addUpdateNotification = function(newNotif, val, network) {
  switch (val[0]) {
    case type.TRANSACTION_HASH:
      return transactionHash(newNotif, val, network);
    case type.TRANSACTION_RECEIPT:
      return transactionReceipt(newNotif, val, network);
    case type.TRANSACTION_ERROR:
      return transactionError(newNotif, val, network);
    default:
      break;
  }
};

const addUpdateSwapNotification = async function(newNotif, val, network) {
  switch (val[0]) {
    case type.TRANSACTION_HASH:
    case type.SWAP_HASH:
      return await swapHash(newNotif, val, network);
    case type.TRANSACTION_RECEIPT:
    case type.SWAP_RECEIPT:
      return await swapReceipt(newNotif, val, network);
    case type.TRANSACTION_ERROR:
    case type.SWAP_ERROR:
      return await swapError(newNotif, val, network);
    case type.SWAP_ORDER:
      return await swapOrder(newNotif, val, network);
    default:
      break;
  }
};
export {
  INVESTIGATE_FAILURE_KEY,
  type,
  notificationType,
  notificationStatuses,
  swapOnlyStatuses,
  swapIndexes,
  txIndexes,
  addUpdateNotification,
  addUpdateSwapNotification
};
