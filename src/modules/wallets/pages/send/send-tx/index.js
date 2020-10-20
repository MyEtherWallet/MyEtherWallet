import BigNumber from 'bignumber.js';
import utils from 'web3-utils';
import { getGasBasedOnType } from './helpers/gasMultipler';
import sanitizeHex from '@/helpers/sanitizeHex';
import validateHexString from '@/helpers/validateHexString';
import { Transaction } from 'ethereumjs-tx';
import Vue from 'vue';
export default class SendTransaction {
  constructor(balance, web3, gasPrice, network) {
    this.balance = balance;
    this.web3 = web3;
    this.gasPrice = gasPrice;
    this.network = network;
  }
  // returns if address is valid
  isValidAddress(hash) {
    return utils.isAddress(hash);
  }

  // returns if data is valid
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
  // balance balance in ether
  getBalETH() {
    return new BigNumber(utils.fromWei(this.balance, 'ether')).toFixed();
  }
  // get the address' entire balance
  getEntireBal(currency, balance, gasLimit) {
    if (this.isToken(currency)) {
      return currency.balance;
    }
    const gasPrice = new BigNumber(this.finalGasPrice()).toString();
    return balance > 0
      ? new BigNumber(balance)
          .minus(
            utils.fromWei(
              new BigNumber(utils.toWei(gasPrice, 'gwei'))
                .times(gasLimit)
                .toString(),
              'ether'
            )
          )
          .toFixed()
      : 0;
  }
  // get final gas price
  finalGasPrice() {
    return getGasBasedOnType(this.gasPrice);
  }
  // show warning if gasPrice is greater than gas limit warning
  showWarning(gasLimitWarning) {
    return this.finalGasPrice >= gasLimitWarning;
  }
  // tx fee
  txFee(gasLimit) {
    return new BigNumber(utils.toWei(this.finalGasPrice(), 'gwei'))
      .times(gasLimit || 0)
      .toFixed();
  }
  // tx fee in ether
  txFeeETH(gasLimit) {
    if (new BigNumber(this.txFee(gasLimit)).gt(0)) {
      const txFee = this.txFee(gasLimit);
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
  // estimate gas from coinbase
  async estimateGas(value, address, gasPrice, data) {
    const coinbase = await this.web3.eth.getCoinbase();
    const params = {
      from: coinbase,
      value: value,
      to: address,
      gasPrice: sanitizeHex(utils.toWei(gasPrice, 'gwei').toString(16)),
      data: data
    };
    await this.web3.eth
      .estimateGas(params)
      .then(gasLimit => {
        return gasLimit;
      })
      .catch(() => {
        return -1;
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
        // TODO: figure out translations to pass tests
        msg: Vue.$i18n ? Vue.$i18n.t('errorsGlobal.invalid-value') : '',
        valid: false
      };
    }
    // if the currency type is a token
    if (this.isToken(currency)) {
      const hasAmountToken = new BigNumber(amount).lte(currency.balance);
      const hasGas = new BigNumber(this.txFeeEth).lte(this.getBalETH());
      const hasBalance =
        hasAmountToken && hasGas && this.hasValidDecimals(amount, currency);
      return {
        valid: hasBalance,
        msg: hasBalance
          ? ''
          : !hasAmountToken
          ? Vue.$i18n // TODO: figure out translations to pass tests
            ? Vue.$i18n.t('errorsGlobal.not-enough-to-send', {
                type: currency.symbol
              })
            : ''
          : !hasGas
          ? Vue.$i18n // TODO: figure out translations to pass tests
            ? Vue.$i18n.t('errorsGlobal.not-enough-to-send', {
                type: Vue.$i18n.t('common.gas.name')
              })
            : ''
          : Vue.$i18n // TODO: figure out translations to pass tests
          ? Vue.$i18n.t('errorsGlobal.invalid-value')
          : ''
      };
    }
    return {
      valid: this.hasAmount && this.hasValidDecimals(amount, currency),
      msg: this.hasAmount
        ? ''
        : !this.hasAmount
        ? Vue.$i18n // TODO: figure out translations to pass tests
          ? Vue.$i18n.t('errorsGlobal.not-enough-to-send', {
              type: this.network.type.currencyName
            })
          : ''
        : Vue.$i18n // TODO: figure out translations to pass tests
        ? Vue.$i18n.t('errorsGlobal.invalid-value')
        : ''
    };
  }
  hasAmount(amount) {
    // right now amount is always returning in ETH
    return new BigNumber(amount).plus(this.txFeeEth).lte(this.getBalETH());
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
    const contract = this.web3.eth.Contract(jsonInterface);
    return contract.methods.transfer(
      hash.toLowerCase(),
      new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toFixed()
    );
  }
  // transaction data
  getTxData(amount, decimals, address, currency, data) {
    if (this.isToken(currency)) {
      return this.getTokenTransferABI(amount, decimals, address);
    }
    return sanitizeHex(data);
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
      this.web3.eth
        .sendTransaction(json)
        .then(response => {
          return response;
        })
        .catch(error => {
          return error;
        });
      this.clear();
    } catch (error) {
      return error;
    }
  }
}
