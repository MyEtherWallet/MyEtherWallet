import { toBN } from 'web3-utils';
import BigNumber from 'bignumber.js';
import { debounce, isFunction, isObject } from 'lodash';
import { useNotificationsStore } from '@/core/store/notifications';
import { NOTIFICATION_TYPES, NOTIFICATION_STATUS } from './handlerNotification';

const VALID_ARGUMENTS = [
  'to', // string
  'from', // string
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
  'formatted', //boolean,
  'refundAddress' // string
];
export default class NonChainNotification {
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
   * Updates status and resolves back to ui with the new object
   */
  updateStatus(status) {
    const { updateNotification } = useNotificationsStore();
    return new Promise(resolve => {
      this.status = status;
      updateNotification(this);
      resolve(this);
    });
  }
  /**
   * Check swap status
   */
  checkSwapStatus(swapper) {
    const { updateNotification } = useNotificationsStore();
    let swapResolver;
    if (
      this.status.toLowerCase() === NOTIFICATION_STATUS.PENDING ||
      this.status.toLowerCase() === NOTIFICATION_STATUS.SUBMITTED
    ) {
      const _this = this;
      const debouncedInterval = debounce(function () {
        const stat = swapper.getStatus(_this.swapObj);
        if (stat && isObject(stat) && isFunction(stat.then)) {
          stat.then(function (res) {
            if (res) {
              const formattedStatus = res.toLowerCase();
              _this.status =
                formattedStatus === NOTIFICATION_STATUS.COMPLETED
                  ? NOTIFICATION_STATUS.SUCCESS.toUpperCase()
                  : formattedStatus === NOTIFICATION_STATUS.FAILED ||
                    formattedStatus === NOTIFICATION_STATUS.UNKNOWN
                  ? NOTIFICATION_STATUS.FAILED.toUpperCase()
                  : res;
            }
          });
        }
        if (_this.status.toLowerCase() !== NOTIFICATION_STATUS.PENDING) {
          _this.read = false;
          updateNotification(_this);
          clearInterval(swapResolver);
        }
      }, 1000);
      swapResolver = setInterval(debouncedInterval, 10000);
    }
  }

  /**
   * set status
   */
  setStatus(status) {
    const { updateNotification } = useNotificationsStore();
    if (status.toLowerCase() !== NOTIFICATION_STATUS.PENDING) {
      this.read = false;
      updateNotification(this);
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

  /**
   * Formats notification obj
   */
  formatNotificiationObj(obj) {
    /**
     * Assigning values: date, value, gasPrice, gas, status
     */
    const date = obj.validUntil
      ? new BigNumber(obj.validUntil).times(1000).toNumber()
      : new Date().getTime();
    /**
     * The Notification Obj
     */
    const notification = {
      from: obj.from,
      to: obj.to,
      status: obj.status ? obj.status : NOTIFICATION_STATUS.PENDING,
      type: obj.type,
      date: date,
      read: !obj.read ? false : obj.read,
      swapObj: obj.swapObj ? obj.swapObj : {},
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
      } else if (obj[keysArray[i]]) {
        this[keysArray[i]] = obj[keysArray[i]];
      }
    }
  }
}
