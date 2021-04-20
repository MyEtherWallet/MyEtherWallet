import { formatters } from 'web3-core-helpers';
import Notification from '@/modules/notifications/handlers/handlerNotification';
import {
  txTypes,
  notificationTypes
} from '@/modules/notifications/configs/configTypes';
import { _ } from 'web3-utils';
const getSanitizedTx = tx => {
  return new Promise((resolve, reject) => {
    if (!tx.gas && !tx.gasLimit && !tx.chainId)
      return reject(new Error('"gas" or "chainId" is missing'));
    if (tx.nonce < 0 || tx.gas < 0 || tx.gasPrice < 0 || tx.chainId < 0)
      return reject(
        new Error('Gas, gasPrice, nonce or chainId is lower than 0')
      );

    try {
      tx = formatters.inputCallFormatter(tx);
      const transaction = tx;
      if (tx.to) transaction.to = tx.to;
      transaction.data = tx.data || '0x';
      transaction.value = tx.value || '0x';
      transaction.chainId = tx.chainId;
      resolve(transaction);
    } catch (e) {
      reject(e);
    }
  });
};

const setEvents = (promiObj, tx, dispatch) => {
  // create a no reference copy specifically for notification
  const newTxObj = _.clone(tx);
  newTxObj.type = notificationTypes.out;
  const isExempt = newTxObj.hasOwnProperty('handleNotification');

  promiObj
    .once('transactionHash', hash => {
      newTxObj.status = txTypes.pending;
      newTxObj.transactionHash = hash;
      if (!isExempt) {
        const notification = new Notification(newTxObj, true);
        dispatch('notifications/addNotification', notification, {
          root: true
        });
      }
    })
    .on('receipt', res => {
      newTxObj.transactionHash = res.transactionHash;
      newTxObj.status = txTypes.success;
      const notification = new Notification(newTxObj, true);
      dispatch('notifications/updateNotification', notification, {
        root: true
      });
    })
    .on('error', err => {
      newTxObj.status = txTypes.failed;
      newTxObj.errMessage = err.message;
      if (!isExempt) {
        const notification = new Notification(newTxObj, true);
        dispatch('notifications/addNotification', notification, {
          root: true
        });
      }
    });
};

export { getSanitizedTx, setEvents };
