import BigNumber from 'bignumber.js';
import utils from 'web3-utils';
import { getGasBasedOnType } from '@/helpers/gasPriceHelper.js';
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
    return BigNumber(gasLimit).gte(0) ? gasLimit : '21000';
  }
  // get fixed gas
  getFixedGas(val) {
    return BigNumber(val).toFixed(2);
  }
  // balance balance in ether
  getBalETH() {
    return BigNumber(utils.fromWei(this.balance, 'ether')).toFixed();
  }
  // get the address' entire balance
  getEntireBal(currency, balance, gasLimit) {
    if (this.isToken(currency)) {
      return currency.balance;
    }
    const gasPrice = BigNumber(this.finalGasPrice()).toString();
    return balance > 0
      ? BigNumber(balance)
          .minus(
            utils.fromWei(
              BigNumber(utils.toWei(gasPrice, 'gwei'))
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
    return BigNumber(this.finalGasPrice())
      .times(gasLimit || 0)
      .toFixed(0);
  }
  // tx fee in ether
  txFeeETH(gasLimit) {
    if (BigNumber(this.txFee(gasLimit)).gt(0)) {
      const txFee = this.txFee(gasLimit);
      return utils.fromWei(txFee, 'ether');
    }
    return '0';
  }
  // tx fee in usd
  txFeeUSD(gasLimit, ethPrice) {
    return BigNumber(
      BigNumber(this.txFeeETH(gasLimit)).times(BigNumber(ethPrice))
    )
      .toFixed(2)
      .toString();
  }

  parsedAmount(amount) {
    return utils.toWei(BigNumber(amount).toString(), 'ether').toString(16);
  }

  // estimate gas from coinbase
  estimateGas(value, address, gasPrice, data) {
    const actualAmount = data !== '0x' ? 0 : value;
    return this.web3.eth.getCoinbase().then(res => {
      const params = {
        from: res,
        value: this.parsedAmount(actualAmount),
        to: address,
        gasPrice: sanitizeHex(BigNumber(gasPrice).toString(16)),
        data: data
      };
      return this.web3.eth.estimateGas(params);
    });
  }
  // check if it is a token
  isToken(currency) {
    const symbol = this.network.type.currencyName;
    return currency.symbol !== symbol;
  }
  // check if its a valid amount
  checkAmount(amount, currency) {
    if (BigNumber(amount).lt(0)) {
      return {
        // TODO: figure out translations to pass tests
        msg: Vue.$i18n ? Vue.$i18n.t('errorsGlobal.invalid-value') : '',
        valid: false
      };
    }
    // if the currency type is a token
    if (this.isToken(currency)) {
      const hasAmountToken = BigNumber(amount).lte(currency.balance);
      const hasGas = BigNumber(this.txFeeEth).lte(this.getBalETH());
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
    return BigNumber(amount).plus(this.txFeeEth).lte(this.getBalETH());
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
    const power = BigNumber(10).pow(decimals);
    const tokenAmount = BigNumber(amount).times(power);
    return contract.methods
      .transfer(hash.toLowerCase(), tokenAmount.toFixed())
      .encodeABI();
  }
  // transaction data
  getTxData(amount, decimals, address, currency) {
    let data = '0x';
    if (this.isToken(currency) && address !== '' && decimals) {
      data = this.getTokenTransferABI(amount, decimals, address);
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
  async submitTransaction(gasLimit, address, amount, data, contractAddress) {
    try {
      const coinbase = await this.web3.eth.getCoinbase();
      const nonce = await this.web3.eth.getTransactionCount(coinbase);
      const toAddress = data === '0x' ? address : contractAddress;
      const actualAmount = data === '0x' ? amount : 0;
      const raw = {
        nonce: sanitizeHex(BigNumber(nonce).toString(16)),
        gasLimit: sanitizeHex(BigNumber(gasLimit).toString(16)),
        to: toAddress,
        value: sanitizeHex(
          BigNumber(this.parsedAmount(actualAmount)).toString(16)
        ),
        data: data
      };
      const _tx = new Transaction(raw);
      const json = _tx.toJSON(true);
      json.from = coinbase;
      // this.clear();
      return this.web3.eth.sendTransaction(json);
    } catch (error) {
      return error;
    }
  }
}
