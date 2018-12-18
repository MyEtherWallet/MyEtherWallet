import { type, notificationStatuses, swapOnlyStatuses } from './config';

import {
  swapHash,
  swapReceipt,
  swapOrder,
  swapError,
  batchSwap
} from './swapNotification';
import {
  batchTransactionReceipt,
  batchTransactionError
} from './batchNotification';
import {
  transactionHash,
  transactionReceipt,
  transactionError
} from './transactionNotification';

const addUpdateNotification = function(newNotif, val, network) {
  switch (val[0]) {
    case type.TRANSACTION_HASH:
      return transactionHash(newNotif, val, network);
    case type.TRANSACTION_RECEIPT:
      return transactionReceipt(newNotif, val, network);
    case type.TRANSACTION_ERROR:
      return transactionError(newNotif, val, network);
    case type.BATCH_TRANSACTION_HASH:
      return transactionHash(newNotif, val, network);
    case type.BATCH_TRANSACTION_RECEIPT:
      return transactionReceipt(
        batchTransactionReceipt(newNotif, val, network),
        val,
        network
      );
    case type.BATCH_TRANSACTION_ERROR:
      return transactionError(
        batchTransactionError(newNotif, val, network),
        val,
        network
      );
    default:
      break;
  }
};

const addUpdateSwapNotification = function(newNotif, val, network) {
  switch (val[0]) {
    case type.SWAP_HASH:
      return swapHash(newNotif, val, network);
    case type.SWAP_RECEIPT:
      return swapReceipt(newNotif, val, network);
    case type.SWAP_ERROR:
      return swapError(newNotif, val, network);
    case type.DEX_SWAP:
      return batchSwap(newNotif, val, network);
    case type.SWAP_ORDER:
      return swapOrder(newNotif, val, network);
    default:
      break;
  }
};

export { addUpdateNotification, addUpdateSwapNotification };
