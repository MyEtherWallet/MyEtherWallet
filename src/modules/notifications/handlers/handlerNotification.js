import { isAddress, isHexStrict, toBN, numberToHex, isBN } from 'web3-utils';
import vuexStore from '@/core/store';
import BigNumber from 'bignumber.js';
import { isFunction, isObject } from 'lodash';

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
  'hash', // string
  'to', // string
  'from', // string
  'gas', // string
  'gasLimit', // string
  'gasPrice', // string
  'data', // number
  'nonce', // string
  'value', // string
  // injected from mew
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
  'swapResolver',
  'formatted' //boolean,
];
/**
 * Notification types
 */
const NOTIFICATION_TYPES = {
  SWAP: 'swap',
  IN: 'in',
  OUT: 'out',
  ERROR: 'error',
  ALL: 'all'
};
/**
 * Transaction status
 */
const NOTIFICATION_STATUS = {
  SUBMITTED: 'submitted',
  PENDING: 'pending',
  SUCCESS: 'success',
  COMPLETED: 'completed',
  FAILED: 'failed',
  UNKNOWN: 'unknown'
};

export { NOTIFICATION_TYPES, NOTIFICATION_STATUS };
export default class Notification {
  constructor(obj) {
    this.read = obj['read'] ? obj['read'] : false;
    this.swapResolver = null;
    /**
     * Format notification obj if it is not formatted yet
     * otherwise validate the notification obj
     */
    obj && !obj.formatted
      ? this.formatNotificiationObj(obj)
      : this.validateNotificationObj(obj);
  }
  /**
   * Formats notification obj
   */
  formatNotificiationObj(obj) {
    /**
     * Assigning values: date, value, gasPrice, gas, status
     */
    const date = obj.timestamp
      ? new BigNumber(obj.timestamp).times(1000).toNumber()
      : new Date().getTime();
    /**
     * The Notification Obj
     */
    const notification = {
      from: obj.from,
      to: obj.to,
      hash: obj.hash,
      gas: isBN(obj.gas) ? numberToHex(obj.gas) : obj.gas,
      gasPrice: isBN(obj.gasPrice) ? numberToHex(obj.gasPrice) : obj.gasPrice,
      nonce: obj.nonce,
      transactionFee: numberToHex(
        this._getTxFee(obj.gasPrice, obj.gasUsed ? obj.gasUsed : obj.gas)
      ),
      status: obj.status ? obj.status : NOTIFICATION_STATUS.PENDING,
      type: obj.type,
      value: isBN(obj.value) ? numberToHex(obj.value) : obj.value,
      date: date,
      read: !obj.read ? false : obj.read,
      swapObj: obj.swapObj ? obj.swapObj : '',
      fromTxData: obj.fromTxData ? obj.fromTxData : {},
      toTxData: obj.toTxData ? obj.toTxData : {},
      network: obj.network ? obj.network : '',
      formatted: true
    };
    if (notification.status === '0x1' || notification.status === '0x0')
      notification.status =
        notification.status === '0x1'
          ? NOTIFICATION_STATUS.SUCCESS
          : NOTIFICATION_STATUS.FAILED;
    this.validateNotificationObj(notification);
  }
  /**
   * Validates notification obj
   */
  validateNotificationObj(obj) {
    const keysArray = Object.keys(obj);
    for (let i = 0; i < keysArray.length; i++) {
      if (!VALID_ARGUMENTS.includes(keysArray[i])) {
        this._invalidType(keysArray[i], obj[keysArray[i]]);
      } else if (
        keysArray[i] === 'type' &&
        !Object.values(NOTIFICATION_TYPES).includes(obj['type'].toLowerCase())
      ) {
        this._invalidType(keysArray[i], obj[keysArray[i]]);
      } else if (
        keysArray[i] === 'status' &&
        !Object.values(NOTIFICATION_STATUS).includes(
          obj['status'].toLowerCase()
        )
      ) {
        this._invalidType(keysArray[i], obj[keysArray[i]]);
      } else if (
        (keysArray[i] === 'to' || keysArray[i] === 'from') &&
        !isAddress(obj[keysArray[i]])
      ) {
        this._invalidType(keysArray[i], obj[keysArray[i]]);
      } else if (keysArray[i] === 'hash' && !isHexStrict(obj[keysArray[i]])) {
        this._invalidType(keysArray[i], obj[keysArray[i]]);
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
      vuexStore.dispatch('notifications/updateNotification', this);
      resolve(this);
    });
  }
  /**
   * Check swap status
   */
  checkSwapStatus(swapper) {
    if (
      this.status.toLowerCase() === NOTIFICATION_STATUS.PENDING ||
      this.status.toLowerCase() === NOTIFICATION_STATUS.SUBMITTED
    ) {
      const _this = this;
      const swapResolver = setInterval(function () {
        const stat = swapper.getStatus(_this.swapObj);
        if (stat && isObject(stat) && isFunction(stat.then)) {
          stat.then(function (res) {
            const formattedStatus = res.toLowerCase();
            _this.status =
              formattedStatus === NOTIFICATION_STATUS.COMPLETED
                ? NOTIFICATION_STATUS.SUCCESS.toUpperCase()
                : formattedStatus === NOTIFICATION_STATUS.FAILED ||
                  formattedStatus === NOTIFICATION_STATUS.UNKNOWN
                ? NOTIFICATION_STATUS.FAILED.toUpperCase()
                : res;
          });
        }
        if (_this.status.toLowerCase() !== NOTIFICATION_STATUS.PENDING) {
          _this.read = false;
          vuexStore.dispatch('notifications/updateNotification', _this);
          clearInterval(swapResolver);
        }
      }, 10000);
    }
  }

  /**
   * set status
   */
  setStatus(status) {
    if (status.toLowerCase() !== NOTIFICATION_STATUS.PENDING) {
      this.read = false;
      vuexStore.dispatch('notifications/updateNotification', this);
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

  _invalidType(type, value) {
    throw new Error(
      `Invalid Notification ${type} : ${value} passed! Please check the parameters passed into the Notification constructor!`
    );
  }
  /**
   * Get Transaction Fee
   */
  _getTxFee(gasPrice, gas) {
    const gasFee = toBN(gasPrice).mul(toBN(gas));
    return gasFee;
  }
}
