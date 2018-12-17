import {
  type,
  notificationType,
  notificationStatuses,
  swapOnlyStatuses
} from './config';
import BigNumber from 'bignumber.js';

const transactionHash = (notifArray, val, network) => {
  notifArray.push({
    title: 'Transaction',
    read: false,
    timestamp: Date.now(),
    type: notificationType.TRANSACTION,
    status: notificationStatuses.PENDING,
    hash: val[2],
    network: network,
    body: {
      error: false,
      errorMessage: '',
      hash: val[2],
      to: val[1].to,
      amount: new BigNumber(val[1].value).toString(),
      nonce: new BigNumber(val[1].nonce).toString(),
      gasPrice: new BigNumber(val[1].gasPrice).toString(),
      gasLimit: new BigNumber(val[1].gas).toString()
    },
    expanded: false
  });
  return notifArray;
};

const transactionReceipt = (notifArray, val) => {
  const idx = notifArray.findIndex(
    entry =>
      entry.hash === val[2].transactionHash &&
      entry.type !== notificationType.SWAP
  );

  notifArray[idx].status = notificationStatuses.COMPLETE;
  notifArray[idx].body.gasUsed = new BigNumber(val[2].gasUsed).toString();
  notifArray[idx].body.blockNumber = new BigNumber(
    val[2].blockNumber
  ).toString();

  return notifArray;
};

const transactionError = (notifArray, val, network) => {
  const idx = notifArray.findIndex(
    entry =>
      entry.hash === val[2].transactionHash &&
      entry.type !== notificationType.SWAP
  );

  if (idx >= 0) {
    notifArray[swapNotificationIndex].body.error = true;
    notifArray[swapNotificationIndex].status = notificationStatuses.FAILED;
    notifArray[swapNotificationIndex].body.errorMessage = val[2].hasOwnProperty(
      'message'
    )
      ? val[2].message
      : val[2];
    notifArray[swapNotificationIndex].body.blockNumber = new BigNumber(
      val[2].blockNumber
    ).toString();

    return notifArray;
  }

  notifArray.push({
    title: 'Transaction',
    read: false,
    timestamp: new Date(),
    type: notificationType.ERROR,
    status: notificationStatuses.FAILED,
    hash: val[2],
    network: network,
    body: {
      error: true,
      errorMessage: val[2].hasOwnProperty('message') ? val[2].message : val[2],
      hash: val[2],
      to: val[1].to,
      amount: new BigNumber(val[1].value).toString(),
      nonce: new BigNumber(val[1].nonce).toString(),
      gasPrice: new BigNumber(val[1].gasPrice).toString(),
      gasLimit: new BigNumber(val[1].gas).toString()
    },
    expanded: false
  });

  return notifArray;
};

export { transactionHash, transactionReceipt, transactionError };
