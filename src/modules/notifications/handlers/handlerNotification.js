import { isAddress, isHex } from 'web3-utils';
import vuexStore from '@/core/store';
/*

NOTE: toTxData can be null if it's just a regular tx
toTxData and fromTxData = {
  currency: 'ETH',
  amount: 0,
  to: '0x.....' (only for toTxData)
}

*/

const VALID_TYPES = ['IN', 'SWAP', 'OUT'];
const VALID_STATUS = ['SUCCESS', 'ERROR', 'PENDING'];
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
  'swapResolved',
  'swapResolver'
];

export default class Notification {
  constructor(obj) {
    this.read = obj['read'] ? obj['read'] : false;
    this.swapResolver = null;
    // validate passed params before assigning to this
    const objArr = Object.keys(obj);
    for (let i = 0; i < objArr.length; i++) {
      if (!VALID_ARGUMENTS.includes(objArr[i])) {
        this._invalidType(objArr[i]);
      } else if (objArr[i] === 'type' && !VALID_TYPES.includes(obj['type'])) {
        this._invalidType(objArr[i]);
      } else if (
        objArr[i] === 'status' &&
        !VALID_STATUS.includes(obj['status'])
      ) {
        this._invalidType(objArr[i]);
      } else if (
        (objArr[i] === 'to' || objArr[i] === 'from') &&
        !isAddress(obj[objArr[i]])
      ) {
        this._invalidType(objArr[i]);
      } else if (objArr[i] === 'transactionHash' && !isHex(obj[objArr[i]])) {
        this._invalidType(objArr[i]);
      } else if (obj[objArr[i]]) {
        this[objArr[i]] = obj[objArr[i]];
      }
    }
  }

  // updates status and resolves back to ui with the new object
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
              ? 'ERRORED'
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

  // updates read and resolves back to ui with the new object
  markAsRead() {
    return new Promise(resolve => {
      this.read = true;
      resolve(this);
    });
  }

  // updates read and resolves back to ui with the new object
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
