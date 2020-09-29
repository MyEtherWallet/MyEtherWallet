import BigNumber from 'bignumber.js';
import utils from 'web3-utils';
import { getGasByType } from './helpers/gasMultipler';
import sanitizeHex from '@/helpers/sanitizeHex';
import validateHexString from '@/helpers/validateHexString';
import { Transaction } from 'ethereumjs-tx';
export default class SendTransaction {
  constructor(account, web3, gasPrice) {
    this.account = account;
    this.web3 = web3;
    this.gasPrice = gasPrice;
  }
  // returns if address is valid
  isValidAddress(hash) {
    return utils.isAddress(hash);
  }

  // returns if gas limit is valid
  isValidData(value) {
    return validateHexString(value);
  }
  // returns if gas limit is valid
  isValidGasLimit(gasLimit) {
    return new BigNumber(gasLimit).gte(0) ? gasLimit : '21000';
  }
  // get fixed gas
  getFixedGas(val) {
    return new BigNumber(val).toFixed(2);
  }
  // fixed balance in ether
  getFixedBal() {
    return new BigNumber(
      utils.fromWei(this.account.balance, 'ether')
    ).toFixed();
  }
  // get the address' entire balance
  getEntireBal(currency, balance, gasLimit) {
    if (this.isToken(currency)) {
      return currency.balance;
    }
    return balance > 0
      ? balance.minus(
          utils.fromWei(
            new BigNumber(utils.toWei(this.finalGasPrice, 'gwei')).times(
              gasLimit
            ).toString,
            'ether'
          )
        )
      : 0;
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
  txFee(gasLimit) {
    return new BigNumber(utils.toWei(this.finalGasPrice(), 'gwei')).times(
      gasLimit || 0
    );
  }
  // tx fee in ether
  txFeeETH(gasLimit) {
    if (new BigNumber(this.txFee(gasLimit)).gt(0)) {
      const txFee = this.txFee(gasLimit).toFixed();
      return utils.fromWei(txFee, 'ether');
    }
    return '0';
  }
  // tx fee in usd
  txFeeUSD(gasLimit, ethPrice) {
    return new BigNumber(
      new BigNumber(this.txFeeETH(gasLimit)).times(new BigNumber(ethPrice))
    )
      .toFixed(2)
      .toString();
  }
  // account balance in ether
  balanceEth() {
    return new BigNumber(utils.fromWei(this.account.balance, 'ether'));
  }
  // estimate gas from coinbase
  async estimateGas(value, address, gasPrice, data) {
    const coinbase = await this.web3.eth.getCoinbase();
    const params = {
      from: coinbase,
      value: value,
      to: address,
      gasPrice: sanitizeHex.sanitizeHex(
        utils.toWei(gasPrice, 'gwei').toString(16)
      ),
      data: data
    };
    this.web3.eth
      .estimateGas(params)
      .then(gasLimit => {
        return gasLimit;
      })
      .catch(error => {
        console.log('error', error);
        return -1;
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
  // returns whether it has valid decimals
  hasValidDecimals(amount, currency) {
    const decimals = (amount + '').split('.')[1];
    if (!decimals) return true;
    if (this.isToken(currency)) {
      return decimals.length <= this.currency.decimals;
    }
    return decimals.length <= 18;
  }
  // token transfer abi
  getTokenTransferABI(amount, decimals, hash) {
    const jsonInterface = [
      {
        constant: false,
        inputs: [
          { name: '_to', type: 'address' },
          { name: '_amount', type: 'uint256' }
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      }
    ];
    const contract = new this.web3.eth.Contract(jsonInterface);
    return contract.methods.transfer(
      hash.toLowerCase(),
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toFixed()
    );
  }
  // transaction data
  getTxData(amount, decimals, address, currency) {
    if (this.isToken(currency)) {
      return this.getTokenTransferABI(amount, decimals, address);
    }
    return sanitizeHex(this.data);
  }
  // transaction value
  getTxValue(currency, amount) {
    if (this.isToken(currency)) {
      return '0x00';
    }
    return sanitizeHex(amount);
  }
  // transaction address
  getTxAddress(currency, hash) {
    // ask about this
    return this.isToken(currency)
      ? currency.address.toLowerCase()
      : hash.toLowerCase().trim();
  }
  // get eth price
  async getEthPrice() {
    const price = await fetch('https://cryptorates.mewapi.io/ticker?filter=ETH')
      .then(response => {
        const json = response.json();
        return json;
      })
      .catch(error => {
        console.error('error', error);
        return 0;
        // throw error
      });
    return typeof price === 'object' ? price.data.ETH.quotes.USD.price : 0;
  }
  // submit transaction
  async submitTransaction(gasLimit, address, amount, data) {
    try {
      const coinbase = await this.web3.eth.getCoinbase();
      const nonce = await this.web3.eth.getTransactionCount(coinbase);
      const raw = {
        nonce: sanitizeHex(new BigNumber(nonce).toString(16)),
        actualGasPrice: sanitizeHex(
          utils.toWei(this.finalGasPrice, 'gwei').toString(16)
        ),
        gasLimit: sanitizeHex(new BigNumber(gasLimit).toString(16)),
        to: address,
        value: amount,
        data: data
      };
      const _tx = new Transaction(raw);
      const json = _tx.toJSON(true);
      json.from = coinbase;
      this.web3.eth.sendTransaction(json).catch(error => {
        return error;
      });
      this.clear();
    } catch (error) {
      return error;
      // Toast.responseHandler(e, Toast.ERROR);
    }
  }
}
