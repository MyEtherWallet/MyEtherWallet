import { isAddress } from 'web3-utils';
import Notification, {
  NOTIFICATION_TYPES,
  NOTIFICATION_STATUS
} from './handlerNotification';
import BigNumber from 'bignumber.js';

const VALID_ARGUMENTS = [
  'validUntil', // number
  'toVal', // string
  'toUsdVal', // string
  'toType', // string
  'toImg', // string
  'to', // string
  'selectedProvider', // obj
  'refundAddress', // string
  'fromImg', // string
  'fromType', // string
  'fromUsdVal', // string
  'fromVal', // string
  'actualTrade', // object
  'type' // string
];

export default class NonChainNotification extends Notification {
  constructor(obj) {
    super(obj);
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
      fromType: obj.fromType,
      toType: obj.toType,
      fromImg: obj.fromImg,
      toImg: obj.toImg,
      fromVal: obj.fromVal,
      toVal: obj.toVal,
      toUsdVal: obj.toUsdVal,
      fromUsdVal: obj.fromUsdVal,
      validUntil: date,
      selectedProvider: obj.selectedProvider,
      totalFees: obj.totalFees,
      gasPriceType: obj.gasPriceType,
      actualTrade: obj.actualTrade
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
      } else if (obj[keysArray[i]]) {
        this[keysArray[i]] = obj[keysArray[i]];
      }
    }
  }
}
