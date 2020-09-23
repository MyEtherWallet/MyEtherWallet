import BigNumber from 'bignumber.js';
import utils from 'web3-utils';
export default class SendTransaction {
  constructor(balance) {
    this.balance = balance;
  }
  getFixedBal() {
    return new BigNumber(utils.fromWei(this.balance, 'ether')).toFixed();
  }
  getEntireBal() {
    return '20000';
  }
}
