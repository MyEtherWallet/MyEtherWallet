import utils from 'web3-utils';

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
        !utils.isAddress(obj[objArr[i]])
      ) {
        this._invalidType(objArr[i]);
      } else if (
        objArr[i] === 'transactionHash' &&
        !utils.isHex(obj[objArr[i]])
      ) {
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
    this.swapResolver = setInterval(() => {
      swapper.getStatus(this.swapObj).then(res => {
        this.status =
          res === 'COMPLETED'
            ? 'SUCCESS'
            : res === 'FAILED' || res === 'UNKOWN'
            ? 'ERRORED'
            : res;
      });
      if (this.status !== 'PENDING') {
        this.read = false;
        clearInterval(this.swapResolver);
      }
    }, 2000);
  }

  // updates expand and resolves back to ui with the new object
  toggleNotification() {
    return new Promise(resolve => {
      this.expanded != this.expanded;
      if (!this.read) this.read = true;
      resolve(this);
    });
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
    console.log(type);
    throw new Error(
      `Invalid Notification ${type} passed! Please check the parameters passed into the Notification constructor!`
    );
  }
}
