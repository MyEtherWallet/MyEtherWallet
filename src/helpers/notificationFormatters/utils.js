import { notificationType, swapIndexes, txIndexes } from './config';

const getSwapEntryIndex = (entry, val) => {
  try {
    if (entry.body.providerAddress) {
      return (
        entry.hash === val[swapIndexes.response].transactionHash &&
        entry.type === notificationType.SWAP &&
        entry.body.providerAddress.toLowerCase() ===
          val[swapIndexes.txDetails].to.toLowerCase()
      );
    }
    return false;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return false;
  }
};

const getSwapEntryIndexForTxReceipt = (entry, val) => {
  try {
    if (entry.body.providerAddress) {
      return (
        entry.hash === val[txIndexes.response].transactionHash &&
        entry.type === notificationType.SWAP &&
        entry.body.providerAddress.toLowerCase() ===
          val[txIndexes.txDetails].to.toLowerCase()
      );
    }
    return false;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return false;
  }
};

const getNotificationIndex = (entry, val) => {
  return (
    entry.hash === val[txIndexes.response].transactionHash &&
    entry.type !== notificationType.SWAP
  );
};

export {
  getSwapEntryIndex,
  getSwapEntryIndexForTxReceipt,
  getNotificationIndex
};
