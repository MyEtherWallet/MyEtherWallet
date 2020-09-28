import BigNumber from 'bignumber.js';
import utils from 'web3-utils';
import { getGasByType } from './helpers/gasMultipler';
import { sanitizeHex } from '@/helpers/sanitizeHex';

export default class SendTransaction {
  constructor(account, web3, gasPrice) {
    this.account = account;
    this.web3 = web3;
    this.gasPrice = gasPrice;
  }
  getFixedGas(val) {
    new BigNumber(val).toFixed(2);
  }
  // fixed balance in ether
  getFixedBal() {
    return new BigNumber(
      utils.fromWei(this.account.balance, 'ether')
    ).toFixed();
  }
  // get the address' entire balance
  entireBal() {
    return this.account.balance;
  }
  // get final gas price
  finalGasPrice() {
    return getGasByType(this.gasPrice);
  }
  // show warning if gasPrice is greater than gas limit warning
  showWarning(gasLimitWarning) {
    return this.finalGasPrice >= gasLimitWarning;
  }
  // tx fee
  txFee() {
    return new BigNumber(utils.toWei(this.finalGasPrice, 'gwei')).times(
      this.gasLimit || 0
    );
  }
  // tx fee in ether
  txFeeEth() {
    if (new BigNumber(this.txFee).gt(0)) {
      return utils.fromWei(this.txFee, 'ether');
    }
    return '0';
  }
  // account balance in ether
  balanceEth() {
    return new BigNumber(utils.fromWei(this.account.balance, 'ether'));
  }
  // estimate gas from coinbase
  async estimateGas(value, to, gasPrice, data) {
    const coinbase = await this.web3.eth.getCoinbase();
    const params = {
      from: coinbase,
      value: value,
      to: to,
      gasPrice: sanitizeHex.sanitizeHex(
        utils.toWei(gasPrice, 'gwei').toString(16)
      ),
      data: data
    };
    this.web3.eth
      .estimateGas(params)
      .then(gasLimit => {
        this.gasLimit = gasLimit;
      })
      .catch(error => {
        console.log('error', error);
        this.gasLimit = -1;
        // throw error
      });
  }
  // check if it is a token
  isToken(currency) {
    const symbol = this.network.type.currencyName;
    return currency.symbol !== symbol;
  }
  // check if its a valid amount
  checkAmount(amount, currency) {
    if (new BigNumber(amount).lt(0)) {
      return {
        msg: this.$t('errorsGlobal.invalid-value'),
        valid: false
      };
    }
    // if the currency type is a token
    if (this.isToken(currency)) {
      const hasAmountToken = new BigNumber(amount).lte(currency.balance);
      const hasGas = new BigNumber(this.txFeeEth).lte(this.balanceEth);
      const hasBalance =
        hasAmountToken && hasGas && this.hasValidDecimals(amount, currency);
      return {
        valid: hasBalance,
        msg: hasBalance
          ? ''
          : !hasAmountToken
          ? this.$tc('errorsGlobal.not-enough-to-send', {
              type: currency.symbol
            })
          : !hasGas
          ? this.$tc('errorsGlobal.not-enough-to-send', {
              type: this.$t('common.gas.name')
            })
          : this.$t('errorsGlobal.invalid-value')
      };
    }
    return {
      valid: this.hasAmount && this.hasValidDecimals(amount, currency),
      msg: this.hasAmount
        ? ''
        : !this.hasAmount
        ? this.$tc('errorsGlobal.not-enough-to-send', {
            type: this.network.type.currencyName
          })
        : this.$t('errorsGlobal.invalid-value')
    };
  }
  hasAmount(amount) {
    // right now amount is always returning in ETH
    return new BigNumber(amount).plus(this.txFeeEth).lte(this.balanceEth);
  }
  hasValidDecimals(amount, currency) {
    const decimals = (amount + '').split('.')[1];
    if (!decimals) return true;
    if (this.isToken(currency)) {
      return decimals.length <= this.currency.decimals;
    }
    return decimals.length <= 18;
  }
}
