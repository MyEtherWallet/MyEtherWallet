import BigNumber from 'bignumber.js';
import utils from 'web3-utils';
import getLatestPrices from '@/modules/tokens/index';
export default class SendTransaction {
  constructor(balance) {
    this.balance = balance;
    this.getLatestPrices = new getLatestPrices();
  }
  getFixedBal() {
    return new BigNumber(utils.fromWei(this.balance, 'ether')).toFixed();
  }
  getEntireBal() {
    return '20000';
  }
}
