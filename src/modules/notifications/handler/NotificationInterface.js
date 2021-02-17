import utils from 'web3-utils';

/*

NOTE: toTxData can be null if it's just a regular tx
toTxData and fromTxData = {
  currency: 'ETH',
  amount: 0,
}

*/

const VALID_TYPES = ['IN', 'SWAP', 'OUT'];
const VALID_STATUS = ['SUCCESS', 'FAILED', 'PENDING'];
const VALID_ARGUMENTS = [
  'txHash', // string
  'toAddress', // string
  'fromAddress', // string
  'gasPrice', // string
  'transactionFee', // string
  'date', // time string (Date.getTime())
  'status', // string
  'fromTxData', // obj
  'toTxData', // obj
  'type', // string
  'read', // bool
  'nonce' // number?
];

export default class Notification {
  constructor(obj) {
    this.expanded = false;

    // validate passed params before assigning to this
    const objArr = Object.keys(obj);
    for (let i = 0; i < objArr.length; i++) {
      if (!VALID_ARGUMENTS.includes(objArr[i])) {
        this._invalidType('parameters');
      } else if (objArr[i] === 'type' && !VALID_TYPES.includes(obj['type'])) {
        this._invalidType(objArr[i]);
      } else if (
        objArr[i] === 'status' &&
        !VALID_STATUS.includes(obj['status'])
      ) {
        this._invalidType(objArr[i]);
      } else if (
        (objArr[i] === 'toAddress' || objArr[i] === 'fromAddress') &&
        !utils.isAddress(obj[objArr[i]])
      ) {
        this._invalidType(objArr[i]);
      } else if (objArr[i] === 'txHash' && !utils.isHex(obj[objArr[i]])) {
        this._invalidType(objArr[i]);
      }
      this[objArr[i]] = obj[objArr[i]];
    }
  }

  // updates status and resolves back to ui with the new object
  updateStatus(status) {
    return Promise(resolve => {
      this.status = status;
      resolve(this);
    });
  }

  // updates expand and resolves back to ui with the new object
  toggleNotification() {
    return Promise(resolve => {
      this.expanded != this.expanded;
      if (!this.read) this.read = true;
      resolve(this);
    });
  }

  // updates read and resolves back to ui with the new object
  markAsRead() {
    return Promise(resolve => {
      this.read = true;
      resolve(this);
    });
  }

  // updates read and resolves back to ui with the new object
  markAsUnread() {
    return Promise(resolve => {
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
