import BigNumber from 'bignumber.js';
import {
  type,
  notificationType,
  notificationStatuses,
  swapOnlyStatuses
} from './config';

const identifySwapForTransaction = (notifArray, val) => {
  const finalTx = val[1][val[1].length - 1];
  console.log(finalTx); // todo remove dev item
  const swapNotificationIndex = notifArray.findIndex(entry => {
    console.log('entry.body.providerAddress', entry.body.providerAddress); // todo remove dev item
    console.log('val[1].to', finalTx.to); // todo remove dev item
    if (entry.body.providerAddress) {
      if (entry.hasTransaction) {
        return (
          entry.hash === val[2].transactionHash &&
          entry.type === notificationType.DEX_SWAP
        );
      }
      return (
        entry.body.providerAddress.toLowerCase() === finalTx.to.toLowerCase() &&
        entry.type === notificationType.DEX_SWAP
      );
    }
    return false;
  });

  if (swapNotificationIndex >= 0) {
    return swapNotificationIndex;
  }
  return null;
};

const batchTransactionHash = (notifArray, val, network) => {
  const finalTx = val[1][val[1].length - 1];
  const swapIdx = identifySwapForTransaction(notifArray, val);
  console.log(swapIdx); // todo remove dev item
  if (swapIdx !== null) {
    notifArray[swapIdx].hash = val[2];
    notifArray[swapIdx].hasTransaction = true;
  }

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
      to: finalTx.to,
      amount: new BigNumber(finalTx.value).toString(),
      nonce: new BigNumber(finalTx.nonce).toString(),
      gasPrice: new BigNumber(finalTx.gasPrice).toString(),
      gasLimit: new BigNumber(finalTx.gas).toString()
    },
    expanded: false
  });

  return notifArray;
};

const batchTransactionReceipt = (notifArray, val) => {
  const swapIdx = identifySwapForTransaction(notifArray, val);
  console.log(swapIdx); // todo remove dev item
  if (swapIdx !== null) {
    notifArray[swapIdx].body.gasUsed = new BigNumber(val[2].gasUsed).toString();
    notifArray[swapIdx].body.blockNumber = new BigNumber(
      val[2].blockNumber
    ).toString();
  }

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

const batchTransactionError = (notifArray, val, network) => {
  const finalTx = val[1][val[1].length - 1];
  notifArray.push({
    title: 'Transaction',
    read: false,
    timestamp: Date.now(),
    type: notificationType.ERROR,
    status: notificationStatuses.FAILED,
    hash: val[2],
    network: network,
    body: {
      error: true,
      errorMessage: val[2].hasOwnProperty('message') ? val[2].message : val[2],
      hash: val[2],
      to: finalTx.to,
      amount: new BigNumber(finalTx.value).toString(),
      nonce: new BigNumber(finalTx.nonce).toString(),
      gasPrice: new BigNumber(finalTx.gasPrice).toString(),
      gasLimit: new BigNumber(finalTx.gas).toString()
    },
    expanded: false
  });

  return notifArray;
};

export { batchTransactionHash, batchTransactionReceipt, batchTransactionError };
