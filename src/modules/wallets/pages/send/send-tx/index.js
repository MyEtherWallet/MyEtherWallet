import BigNumber from 'bignumber.js';
import web3 from 'web3-utils';
import TokensList from '@/modules/tokens/index';
import { getGasByType } from './helpers/gasMultipler';

export default class SendTransaction {
  constructor(balance, gasPrice, gasLimitWarning, apollo) {
    this.gasPrice = gasPrice;
    this.balance = balance;
    this.apollo = apollo;
    this.gasLimitWarning = gasLimitWarning;
    this.tokens = new TokensList(apollo);
  }
  getOwnersERC20Tokens(hash) {
    TokensList.getOwnersERC20Tokens(hash);
  }
  getFixedBal() {
    return new BigNumber(web3.fromWei(this.balance, 'ether')).toFixed();
  }
  entireBal() {
    return '20000';
  }
  finalGasPrice() {
    return getGasByType(this.gasPrice);
  }
  showWarning() {
    return this.finalGasPrice >= this.gasLimitWarning;
  }
  txFee() {
    return new BigNumber(web3.toWei(this.finalGasPrice, 'gwei')).times(
      this.gasLimit || 0
    );
  }
  txFeeEth() {
    if (new BigNumber(this.txFee).gt(0)) {
      return web3.fromWei(this.txFee, 'ether')
    }
    return '0';
  }
}
