import {
  swapIndexes,
  notificationType,
  notificationStatuses,
  swapOnlyStatuses
} from './config';
import BigNumber from 'bignumber.js';
import { formatSwap, formatSwapError } from './formatters';

// const parseErrors = (errorMessage) =>{
//   const leadingStriped = errorMessage.replace('Returned error: ', '');
//   const knownTxError = /known transaction/.test(leadingStriped);
//
//
// }

const getSwapEntryIndex = (entry, val) => {
  try {
    console.log('entry.body.providerAddress', entry.body.providerAddress); // todo remove dev item
    if (entry.body.providerAddress) {
      console.log(
        entry.hash === val[swapIndexes.response].transactionHash &&
          entry.type === notificationType.SWAP &&
          entry.body.providerAddress.toLowerCase() ===
            val[swapIndexes.txDetails].to.toLowerCase()
      ); // todo remove dev item
      return (
        entry.hash === val[swapIndexes.response].transactionHash &&
        entry.type === notificationType.SWAP &&
        entry.body.providerAddress.toLowerCase() ===
          val[swapIndexes.txDetails].to.toLowerCase()
      );
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
};

const swapHash = (notifArray, val, network) => {
  notifArray.push(formatSwap(val, network));

  return notifArray;
};

const swapReceipt = async (notifArray, val) => {
  const idx = notifArray.findIndex(entry => getSwapEntryIndex(entry, val));

  notifArray[idx].status = val[swapIndexes.response].status
    ? notificationStatuses.COMPLETE
    : notificationStatuses.FAILED;
  if (notifArray[idx].body.isDex) {
    notifArray[idx].swapStatus = val[swapIndexes.response].status
      ? notificationStatuses.COMPLETE
      : notificationStatuses.FAILED;
    notifArray[idx].body.timeRemaining = -1;
  }
  notifArray[idx].body.gasUsed = new BigNumber(
    val[swapIndexes.response].gasUsed
  ).toString();
  notifArray[idx].body.blockNumber = new BigNumber(
    val[swapIndexes.response].blockNumber
  ).toString();

  console.log(notifArray[idx]); // todo remove dev item
  return notifArray;
};

// For swaps not using the ethereum network
const swapOrder = (notifArray, val, network) => {
  notifArray.push(formatSwap(val, network));

  return notifArray;
};

const swapError = (notifArray, val, network) => {
  const idx = notifArray.findIndex(entry => getSwapEntryIndex(entry, val));

  console.log('notifArray length1', notifArray.length); // todo remove dev item
  console.log('swap error:', idx); // todo remove dev item
  console.log(
    '!/known transaction/.test(swapIndexes.response)',
    !/known transaction/.test(val[swapIndexes.response].message)
  ); // todo remove dev item
  if (!/known transaction/.test(swapIndexes.response).message) {
    if (idx >= 0) {
      notifArray[idx].type = notificationType.SWAP_ERROR;
      notifArray[idx].body.error = true;
      notifArray[idx].status = notificationStatuses.FAILED;
      notifArray[idx].swapStatus = notificationStatuses.FAILED;
      notifArray[idx].body.errorMessage = val[
        swapIndexes.response
      ].hasOwnProperty('message')
        ? val[swapIndexes.response].message
        : val[swapIndexes.response];
      notifArray[idx].body.blockNumber = new BigNumber(
        val[swapIndexes.response].blockNumber
      ).toString();
      return notifArray;
    }
    notifArray.push(formatSwapError(val, network));
    return notifArray;
  }

  console.log('notifArray length2', notifArray.length); // todo remove dev item

  notifArray.push(formatSwapError(val, network));
  return notifArray;
};

export { swapHash, swapReceipt, swapOrder, swapError };
