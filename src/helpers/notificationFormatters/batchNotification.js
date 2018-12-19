import BigNumber from 'bignumber.js';
import { notificationStatuses, swapIndexes } from './config';

const batchTransactionReceipt = (notifArray, val) => {
  try {
    const swapNotificationIndex = notifArray.findIndex(entry => {
      if (entry.body.providerAddress) {
        return (
          entry.hash === val[swapIndexes.response].transactionHash &&
          entry.body.providerAddress.toLowerCase() ===
            val[swapIndexes.details].to.toLowerCase()
        );
      }
      return false;
    });
    if (~swapNotificationIndex) {
      notifArray[swapNotificationIndex].status = notificationStatuses.COMPLETE;
      notifArray[swapNotificationIndex].swapStatus =
        notificationStatuses.COMPLETE;
      notifArray[swapNotificationIndex].body.gasUsed = new BigNumber(
        val[swapIndexes.response].gasUsed
      ).toString();
      notifArray[swapNotificationIndex].body.blockNumber = new BigNumber(
        val[swapIndexes.response].blockNumber
      ).toString();
      return notifArray;
    }

    return notifArray;
  } catch (e) {
    return notifArray;
  }
};

const batchTransactionError = (notifArray, val) => {
  const swapNotificationIndex = notifArray.findIndex(entry => {
    if (entry.body.providerAddress) {
      return (
        entry.hash === val[swapIndexes.response].transactionHash &&
        entry.body.providerAddress.toLowerCase() ===
          val[swapIndexes.details].to.toLowerCase()
      );
    }
    return false;
  });

  if (~swapNotificationIndex) {
    notifArray[swapNotificationIndex].body.error = true;
    notifArray[swapNotificationIndex].status = notificationStatuses.FAILED;
    notifArray[swapNotificationIndex].swapStatus = notificationStatuses.FAILED;
    notifArray[swapNotificationIndex].body.errorMessage = val[
      swapIndexes.response
    ].hasOwnProperty('message')
      ? val[swapIndexes.response].message
      : val[swapIndexes.response];
    notifArray[swapNotificationIndex].body.blockNumber = new BigNumber(
      val[swapIndexes.response].blockNumber
    ).toString();

    return notifArray;
  }

  return notifArray;
};

export { batchTransactionReceipt, batchTransactionError };
