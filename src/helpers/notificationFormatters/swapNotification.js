import {
  swapIndexes,
  notificationType,
  notificationStatuses,
  swapOnlyStatuses
} from './config';
import BigNumber from 'bignumber.js';
import { formatSwap, formatSwapError } from './formatters';

const swapHash = (notifArray, val, network) => {
  console.log('swapHash', val); // todo remove dev item

  notifArray.push(formatSwap(val, network));

  return notifArray;
};

const swapReceipt = (notifArray, val) => {
  console.log('swapReceipt', val); // todo remove dev item

  const idx = notifArray.findIndex(
    entry =>
      entry.hash === val[swapIndexes.response].transactionHash &&
      entry.type === notificationType.SWAP
  );

  notifArray[idx].status = notificationStatuses.COMPLETE;
  if (notifArray[idx].body.isDex) {
    notifArray[idx].swapStatus = notificationStatuses.COMPLETE;
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
  console.log('swapOrder', val); // todo remove dev item
  notifArray.push(formatSwap(val, network));

  return notifArray;
};

const swapError = (notifArray, val, network) => {
  const idx = notifArray.findIndex(
    entry =>
      entry.hash === val[swapIndexes.response].transactionHash &&
      entry.type === notificationType.SWAP
  );
  console.log('notifArray length1', notifArray.length); // todo remove dev item
  console.log('swap error:', idx); // todo remove dev item
  console.log(
    '!/known transaction/.test(swapIndexes.response)',
    !/known transaction/.test(swapIndexes.response)
  ); // todo remove dev item
  if (!/known transaction/.test(swapIndexes.response)) {
    if (idx >= 0) {
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
    } else {
      notifArray.push(formatSwapError(val, network));
      return notifArray;
    }
  }

  console.log('notifArray length2', notifArray.length); // todo remove dev item

  notifArray.push(formatSwapError(val, network));
  return notifArray;
};

const batchSwap = (notifArray, val, network) => {
  notifArray.push({
    title: 'Swap Kyber',
    read: false,
    timestamp: Date.now(),
    type: notificationType.SWAP,
    status: notificationStatuses.PENDING,
    swapStatus: swapOnlyStatuses.SENT,
    hasTransaction: true,
    hash: val[3],
    network: network,
    body: {
      error: false,
      errorMessage: '',
      multi: true,
      providerAddress: val[2].providerAddress,
      to: val[2].toAddress,
      from: val[2].fromAddress,
      fromValue: val[2].fromValue,
      toValue: val[2].toValue,
      fromCurrency: val[2].fromCurrency,
      toCurrency: val[2].toCurrency,
      orderId: val[2].parsed.orderId,
      statusId: val[2].parsed.statusId,
      timeRemaining: val[2].parsed.validFor,
      validFor: val[2].parsed.validFor,
      createdAt: val[2].parsed.timestamp,
      rate: val[2].rate,
      provider: val[2].provider,
      isDex: val[2].isDex
    },
    expanded: false
  });

  return notifArray;
};

export { swapHash, swapReceipt, swapOrder, swapError, batchSwap };
