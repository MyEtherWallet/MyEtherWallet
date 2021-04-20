import { isAddress, isHexStrict } from 'web3-utils';
import vuexStore from '@/core/store';
import { txTypes, notificationTypes } from '../configs/configTypes';
import BigNumber from 'bignumber.js';
import { hexToNumberString, hexToNumber, fromWei, toBN } from 'web3-utils';

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
  'transactionHash', // string
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
  'swapResolver'
];

export default class Notification {
  constructor(obj, onInit) {
    this.read = obj['read'] ? obj['read'] : false;
    this.swapResolver = null;
    /**
     * Format notification obj only if it is on first init
     * otherwise validate the notification obj
     */
    onInit
      ? this.formatNotificiationObj(obj)
      : this.validateNotificationObj(obj);
  }
  /**
   * Formats notification obj
   */
  formatNotificiationObj(obj) {
    /**
     * Assigning values: date, value, gasPrice, status
     */
    const date = obj.timestamp
      ? new BigNumber(obj.timestamp).times(1000).toFixed()
      : new Date().getTime();
    const value = isHexStrict(obj.value)
      ? hexToNumberString(obj.value)
      : obj.value;
    const gasPrice = isHexStrict(obj.gasPrice)
      ? hexToNumberString(obj.gasPrice)
      : obj.gasPrice
      ? obj.gasPrice
      : 0;
    const status =
      isHexStrict(obj.status) && hexToNumber(obj.status)
        ? txTypes.success
        : obj.status
        ? obj.status
        : txTypes.error;
    /**
     * The Notification Obj
     */
    const notification = {
      from: obj.from,
      to: obj.to,
      gasLimit: isHexStrict(obj.gasLimit)
        ? hexToNumberString(obj.gasLimit)
        : obj.gasLimit
        ? obj.gasLimit
        : obj.gas
        ? obj.gas
        : '0x',
      data: obj.input ? obj.input : obj.data,
      transactionHash: obj.transactionHash || obj.hash,
      gas: isHexStrict(obj.gas)
        ? fromWei(hexToNumberString(obj.gas), 'gwei')
        : obj.gas,
      gasPrice: fromWei(toBN(gasPrice), 'gwei'),
      nonce: isHexStrict(obj.nonce)
        ? fromWei(hexToNumberString(obj.nonce), 'gwei')
        : obj.nonce,
      transactionFee: obj.txFee
        ? obj.txFee
        : obj.transactionFee
        ? obj.transactionFee
        : this._getTxFee(obj.value, obj.gasPrice, obj.gasUsed),
      status: status,
      type: obj.type ? obj.type : notificationTypes.in,
      value: toBN(value) ? fromWei(toBN(value), 'ether') : value,
      date: date,
      read: !obj.read ? date < obj.lastFetched : obj.read,
      swapObj: obj.swapObj ? obj.swapObj : '',
      fromTxData: obj.fromTxData ? obj.fromTxData : {},
      toTxData: obj.toTxData ? obj.toTxData : {},
      network: obj.network ? obj.network : ''
    };
    this.validateNotificationObj(notification);
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
        !Object.values(notificationTypes).includes(obj['type'].toLowerCase())
      ) {
        this._invalidType(keysArray[i]);
      } else if (
        keysArray[i] === 'status' &&
        !Object.values(txTypes).includes(obj['status'].toLowerCase())
      ) {
        this._invalidType(keysArray[i]);
      } else if (
        (keysArray[i] === 'to' || keysArray[i] === 'from') &&
        !isAddress(obj[keysArray[i]])
      ) {
        this._invalidType(keysArray[i]);
      } else if (
        keysArray[i] === 'transactionHash' &&
        !isHexStrict(obj[keysArray[i]])
      ) {
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
      vuexStore.dispatch('notifications/updateNotification', this);
      resolve(this);
    });
  }
  /**
   * Check swap status
   */
  checkSwapStatus(swapper) {
    if (this.status.toLowerCase() === txTypes.pending) {
      const _this = this;
      _this.swapResolver = setInterval(() => {
        swapper.getStatus(_this.swapObj).then(res => {
          const formattedStatus = res.toLowerCase();
          _this.status =
            formattedStatus === txTypes.completed
              ? txTypes.success.toUpperCase()
              : formattedStatus === txTypes.failed ||
                formattedStatus === txTypes.unknown
              ? txTypes.failed.toUpperCase()
              : res;
        });
        if (_this.status.toLowerCase() !== txTypes.pending) {
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
  /**
   * Get Transaction Fee
   */
  _getTxFee(value, gasPrice, gasUsed) {
    const gasFee = toBN(gasPrice).mul(toBN(gasUsed));
    const total = toBN(value).add(gasFee);
    return fromWei(total, 'ether');
  }
  /**
   * Get Transaction Status
   */
  _getTxStatus(status) {
    return hexToNumber(status) ? txTypes.success : txTypes.error;
  }
}
