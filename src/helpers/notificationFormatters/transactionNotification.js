import {
  type,
  notificationType,
  notificationStatuses,
  swapOnlyStatuses,
  txIndexes
} from './config';
import BigNumber from 'bignumber.js';

import { formatHash, formatError } from './formatters';

const transactionHash = (notifArray, val, network) => {
  notifArray.push(formatHash(val, network));
  return notifArray;
};

const transactionReceipt = (notifArray, val, network) => {
  const idx = notifArray.findIndex(
    entry =>
      entry.hash === val[txIndexes.response].transactionHash &&
      entry.type !== notificationType.SWAP
  );

  notifArray[idx].status = notificationStatuses.COMPLETE;
  notifArray[idx].body.gasUsed = new BigNumber(
    val[txIndexes.response].gasUsed
  ).toString();
  notifArray[idx].body.blockNumber = new BigNumber(
    val[txIndexes.response].blockNumber
  ).toString();

  return notifArray;
};

const transactionError = (notifArray, val, network) => {
  const idx = notifArray.findIndex(
    entry =>
      entry.hash === val[txIndexes.response].transactionHash &&
      entry.type !== notificationType.SWAP
  );
  console.log('error item location:', idx); // todo remove dev item
  if (idx >= 0 && !val[txIndexes.response].message) {
    notifArray[idx].body.error = true;
    notifArray[idx].type = notificationType.ERROR;
    notifArray[idx].status = notificationStatuses.FAILED;
    notifArray[idx].body.errorMessage = val[txIndexes.response].hasOwnProperty(
      'message'
    )
      ? val[txIndexes.response].message
      : val[txIndexes.response];

    return notifArray;
  }

  notifArray.push(formatError(val, network));

  return notifArray;
};

export { transactionHash, transactionReceipt, transactionError };
