import Notification from './handlerNotification';

export default class NonChainNotification extends Notification {
  constructor(obj) {
    super(obj);
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
    if (this.status.toLowerCase() === NOTIFICATION_STATUS.PENDING) {
      const _this = this;
      _this.swapResolver = setInterval(() => {
        swapper.getStatus(_this.swapObj).then(res => {
          const formattedStatus = res.toLowerCase();
          _this.status =
            formattedStatus === NOTIFICATION_STATUS.COMPLETED
              ? NOTIFICATION_STATUS.SUCCESS.toUpperCase()
              : formattedStatus === NOTIFICATION_STATUS.FAILED ||
                formattedStatus === NOTIFICATION_STATUS.UNKNOWN
              ? NOTIFICATION_STATUS.FAILED.toUpperCase()
              : res;
        });
        if (_this.status.toLowerCase() !== NOTIFICATION_STATUS.PENDING) {
          _this.read = false;
          vuexStore.dispatch('notifications/updateNotification', _this);
          clearInterval(_this.swapResolver);
        }
      }, 10000);
    }
  }
}
