import BigNumber from 'bignumber.js';
import { notificationStatuses, notificationType } from './config';

const batchTransactionReceipt = (notifArray, val) => {
  try {
    const swapNotificationIndex = notifArray.findIndex(entry => {
      if (entry.body.providerAddress) {
        return (
          entry.hash === val[2].transactionHash &&
          entry.body.providerAddress.toLowerCase() === val[1].to.toLowerCase()
        );
      }
      return false;
    });
    if (swapNotificationIndex >= 0) {
      notifArray[swapNotificationIndex].status = notificationStatuses.COMPLETE;
      notifArray[swapNotificationIndex].swapStatus =
        notificationStatuses.COMPLETE;
      notifArray[swapNotificationIndex].body.gasUsed = new BigNumber(
        val[2].gasUsed
      ).toString();
      notifArray[swapNotificationIndex].body.blockNumber = new BigNumber(
        val[2].blockNumber
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
        entry.hash === val[2].transactionHash &&
        entry.body.providerAddress.toLowerCase() === val[1].to.toLowerCase()
      );
    }
    return false;
  });
  if (swapNotificationIndex >= 0) {
    notifArray[swapNotificationIndex].body.error = true;
    notifArray[swapNotificationIndex].status = notificationStatuses.FAILED;
    notifArray[swapNotificationIndex].swapStatus = notificationStatuses.FAILED;
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

  return notifArray;
};

export { batchTransactionReceipt, batchTransactionError };
