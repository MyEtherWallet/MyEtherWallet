import { isAddress, isHex } from 'web3-utils';
import vuexStore from '@/core/store';
import { txTypes, notificationTypes } from '../configs/configTypes';

/**
 * NOTE: toTxData can be null if it's just a regular tx
 * toTxData and fromTxData = {
 * currency: 'ETH',
 * amount: 0,
 * to: '0x.....' (only for toTxData)
 * }
 */

/**
 * Valid values for notification obj
 */
const VALID_ARGUMENTS = [
  'to', // string
  'from', // string
  'gas', // string
  'gasUsed', //string
  'gasLimit', // string
  'gasPrice', // string
  'data', // number
  'nonce', // string
  /**
   * Injected from mew
   */
  'toObj', // string
  'fromObj', // string
  'timestamp', // string
  'amount', // string
  'total', // string
  'txHash', // string
  'type', // string
  'read', // bool
  'network', // string
  'transactionFee', // string
  'date', // number
  'status', // string
  'fromTxData', // obj
  'toTxData', // obj
  'errMessage', // string
  'swapObj', // obj
  'swapResolver'
];

export default class Notification {
  constructor(obj) {
    this.read = obj['read'] ? obj['read'] : false;
    this.swapResolver = null;
    this.validateNotificationObj(obj);
  }
  /**
   * Validates notification obj
   */
  validateNotificationObj(obj) {
    const keysArray = Object.keys(obj);
    for (let i = 0; i < keysArray.length; i++) {
      if (!VALID_ARGUMENTS.includes(keysArray[i])) {
        this._invalidType(keysArray[i]);
      } else if (
        keysArray[i] === 'type' &&
        !notificationTypes.hasOwnProperty(obj['type'].value)
      ) {
        this._invalidType(keysArray[i]);
      } else if (
        keysArray[i] === 'status' &&
        !txTypes.hasOwnProperty(obj['status'].value)
      ) {
        this._invalidType(keysArray[i]);
      } else if (
        (keysArray[i] === 'to' || keysArray[i] === 'from') &&
        !isAddress(obj[keysArray[i]].value)
      ) {
        this._invalidType(keysArray[i]);
      } else if (keysArray[i] === 'txHash' && !isHex(obj[keysArray[i]].value)) {
        this._invalidType(keysArray[i]);
      } else if (obj[keysArray[i]]) {
        this[keysArray[i]] = obj[keysArray[i]];
      }
    }
  }
  /**
   * Updates status and resolves back to ui with the new object
   */
  updateStatus(status) {
    return new Promise(resolve => {
      this.status = status;
      resolve(this);
    });
  }

  checkSwapStatus(swapper) {
    if (this.status === 'PENDING') {
      const _this = this;
      _this.swapResolver = setInterval(() => {
        swapper.getStatus(_this.swapObj).then(res => {
          _this.status =
            res === 'COMPLETED'
              ? 'SUCCESS'
              : res === 'FAILED' || res === 'UNKOWN'
              ? 'FAILED'
              : res;
        });
        if (_this.status !== 'PENDING') {
          _this.read = false;
          vuexStore.dispatch('notifications/updateNotification', _this);
          clearInterval(_this.swapResolver);
        }
      }, 10000);
    }
  }

  /**
   * Updates read and resolves back to ui with the new object
   */
  markAsRead() {
    return new Promise(resolve => {
      this.read = true;
      resolve(this);
    });
  }

  /**
   * Updates read and resolves back to ui with the new object
   */
  markAsUnread() {
    return new Promise(resolve => {
      this.read = false;
      resolve(this);
    });
  }

  _invalidType(type) {
    throw new Error(
      `Invalid Notification ${type} passed! Please check the parameters passed into the Notification constructor!`
    );
  }
}
