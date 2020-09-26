import BigNumber from 'bignumber.js';
import utils from 'web3-utils';
import TokensList from '@/modules/tokens/index';

export default class SendTransaction {
  constructor(balance, apollo) {
    this.balance = balance;
    this.apollo = apollo;
    this.tokens = new TokensList(apollo);
  }
  getOwnersERC20Tokens(hash) {
    TokensList.getOwnersERC20Tokens(hash);
  }
  getFixedBal() {
    return new BigNumber(utils.fromWei(this.balance, 'ether')).toFixed();
  }
  getEntireBal() {
    return '20000';
  }
}
