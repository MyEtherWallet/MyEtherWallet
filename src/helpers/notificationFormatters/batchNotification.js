import BigNumber from 'bignumber.js';
import {
  type,
  notificationType,
  notificationStatuses,
  swapOnlyStatuses
} from './config';
import {
  transactionHash,
  transactionReceipt,
  transactionError
} from './transactionNotification';

const identifySwapForTransaction = (notifArray, val) => {
  const finalTx = val[1];
  console.log(finalTx); // todo remove dev item
  const swapNotificationIndex = notifArray.findIndex(entry => {
    console.log('entry.body.providerAddress', entry.body.providerAddress); // todo remove dev item
    console.log('val[1].to', finalTx.to); // todo remove dev item
    console.log('entry.hash', entry.hash); // todo remove dev item
    console.log('val[2].transactionHash', val[2].transactionHash); // todo remove dev item
    console.log('--------------------------------'); // todo remove dev item
    if (entry.body.providerAddress) {
      // if (entry.hasTransaction) {
      //   return (
      //     entry.hash === val[2].transactionHash &&
      //     entry.type === notificationType.DEX_SWAP
      //   );
      // }
      return (
        entry.hash === val[2].transactionHash &&
        entry.body.providerAddress.toLowerCase() === finalTx.to.toLowerCase()
      );
    }
    return false;
  });

  if (swapNotificationIndex >= 0) {
    return swapNotificationIndex;
  }
  return null;
};

// const batchTransactionHash = (notifArray, val, network) => {
//   const swapIdx = identifySwapForTransaction(notifArray, val);
//   console.log(swapIdx); // todo remove dev item
//   if (swapIdx !== null) {
//     notifArray[swapIdx].hash = val[2];
//     notifArray[swapIdx].hasTransaction = true;
//   }
//
//   return notifArray;
// };

const batchTransactionReceipt = (notifArray, val) => {
  // const swapIdx = identifySwapForTransaction(notifArray, val);
  try {
    const swapNotificationIndex = notifArray.findIndex(entry => {
      console.log('entry.body.providerAddress', entry.body.providerAddress); // todo remove dev item
      console.log('val[1].to', val[1].to); // todo remove dev item
      console.log('entry.hash', entry.hash); // todo remove dev item
      console.log('val[2].transactionHash', val[2].transactionHash); // todo remove dev item
      console.log('--------------------------------'); // todo remove dev item
      if (entry.body.providerAddress) {
        return (
          entry.hash === val[2].transactionHash &&
          entry.body.providerAddress.toLowerCase() === val[1].to.toLowerCase()
        );
      }
      return false;
    });
    console.log(swapNotificationIndex); // todo remove dev item
    if (swapNotificationIndex >= 0) {
      const updatedSwapEntry = notifArray[swapNotificationIndex];
      updatedSwapEntry.body.gasUsed = new BigNumber(val[2].gasUsed).toString();
      notifArray[swapNotificationIndex].body.blockNumber = new BigNumber(
        val[2].blockNumber
      ).toString();
      notifArray[swapNotificationIndex] = updatedSwapEntry;
      return notifArray;
    }

    return notifArray;
  } catch (e) {
    return notifArray;
  }
};

const batchTransactionError = (notifArray, val, network) => {
  return notifArray;
};

export { batchTransactionReceipt, batchTransactionError };
