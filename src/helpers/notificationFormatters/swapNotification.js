import {
  type,
  notificationType,
  notificationStatuses,
  swapOnlyStatuses
} from './config';
import BigNumber from 'bignumber.js';
import { formatSwap } from './formatters'

const swapHash = (notifArray, val, network) => {
  console.log('swapHash', val); // todo remove dev item

  notifArray.push(formatSwap(val, network));

  return notifArray;
};

const swapReceipt = (notifArray, val) => {
  console.log('swapReceipt', val); // todo remove dev item

  const idx = notifArray.findIndex(
    entry =>
      entry.hash === val[3].transactionHash &&
      entry.type === notificationType.SWAP
  );

  notifArray[idx].status = notificationStatuses.COMPLETE;
  if (notifArray[idx].body.isDex) {
    notifArray[idx].swapStatus = notificationStatuses.COMPLETE;
    notifArray[idx].body.timeRemaining = -1;
  }
  notifArray[idx].body.gasUsed = new BigNumber(val[3].gasUsed).toString();
  notifArray[idx].body.blockNumber = new BigNumber(
    val[3].blockNumber
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
      entry.hash === val[2].transactionHash &&
      entry.type === notificationType.SWAP
  );

  if (idx >= 0 && !/known transaction/.test(val[2])) {
    notifArray[idx].body.error = true;
    notifArray[idx].status = notificationStatuses.FAILED;
    notifArray[idx].swapStatus = notificationStatuses.FAILED;
    notifArray[idx].body.errorMessage = val[2].hasOwnProperty('message')
      ? val[2].message
      : val[2];
    notifArray[idx].body.blockNumber = new BigNumber(
      val[2].blockNumber
    ).toString();

    return notifArray;
  }

  // notifArray.push({
  //   title: 'Swap',
  //   read: false,
  //   timestamp: Date.now(),
  //   type: notificationType.SWAP,
  //   status: notificationStatuses.FAILED,
  //   swapStatus: swapOnlyStatuses.FAILED,
  //   hasTransaction: true,
  //   hash: undefined,
  //   network: network,
  //   body: {
  //     error: true,
  //     errorMessage: val[2].hasOwnProperty('message') ? val[2].message : val[2],
  //     hash: undefined,
  //     to: val[1].to,
  //     amount: new BigNumber(val[1].value).toString(),
  //     nonce: new BigNumber(val[1].nonce).toString(),
  //     gasPrice: new BigNumber(val[1].gasPrice).toString(),
  //     gasLimit: new BigNumber(val[1].gas).toString()
  //   },
  //   expanded: false
  // });
  //
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
