import BigNumber from 'bignumber.js';
import utils, { toBN, toHex, toChecksumAddress } from 'web3-utils';
import { getGasBasedOnType } from '@/helpers/gasPriceHelper.js';
import sanitizeHex from '@/helpers/sanitizeHex';
import validateHexString from '@/helpers/validateHexString';
import { Transaction } from 'ethereumjs-tx';
export default class SendTransaction {
  constructor(web3, address, defaultCurrency) {
    this.address = address;
    this.web3 = web3;
    this.defaultCurrency = defaultCurrency;
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
  // balance in ether
  getBalETH() {
    return this.web3.eth.getBalance(this.address).then(amount => {
      return utils.fromWei(amount);
    });
  }
  // get the address' entire balance
  getEntireBal(currency, balance, gasLimit) {
    return this.finalGasPrice().then(finalGas => {
      if (this.isToken(currency)) {
        return currency.balance;
      }
      const fee = finalGas.mul(toBN(gasLimit));
      return balance.gt(balance.sub(fee)) > 0 ? balance.sub(fee) : 0;
    });
  }
  // get final gas price
  finalGasPrice() {
    return this.web3.eth.getGasPrice().then(gPrice => {
      return toBN(getGasBasedOnType(gPrice));
    });
  }
  // show warning if gasPrice is greater than gas limit warning
  showWarning(gasLimitWarning) {
    return this.finalGasPrice().then(gPrice => {
      return gPrice >= gasLimitWarning;
    });
  }
  // tx fee
  txFee(gasLimit) {
    return this.finalGasPrice().then(gPrice => {
      return toBN(gPrice).mul(toBN(gasLimit));
    });
  }
  // tx fee in ether
  txFeeETH(gasLimit) {
    return this.txFee(gasLimit).then(fee => utils.fromWei(fee));
  }
  // tx fee in usd
  txFeeUSD(gasLimit, ethPrice) {
    return this.txFeeETH(gasLimit).then(fee => {
      return BigNumber(fee).times(BigNumber(ethPrice)).toFixed(2).toString();
    });
  }
  // estimate gas from coinbase
  estimateGas(value, address, gasPrice, data) {
    const actualAmount = data !== '0x' ? 0 : value;
    return this.web3.eth.getCoinbase().then(res => {
      const params = {
        from: res,
        value: this.parsedAmount(actualAmount),
        to: address,
        gasPrice: sanitizeHex(BigNumber(gasPrice).toString()),
        data: data
      };
      return this.web3.eth.estimateGas(params);
    });
  }
  // check if it is a token
  isToken(currency) {
    return currency.symbol !== this.defaultCurrency;
  }
  // check if its a valid amount
  // eslint-disable-next-line no-unused-vars
  async checkAmount(amount, currency) {
    return {
      valid: true
    };
    // if (amount.lten(0)) {
    //   return {
    //     // TODO: figure out translations to pass tests
    //     msg: Vue.$i18n ? Vue.$i18n.t('errorsGlobal.invalid-value') : '',
    //     valid: false
    //   };
    // }
    // // if the currency type is a token
    // if (this.isToken(currency)) {
    //   const hasAmountToken = amount.lte(currency.balance);
    //   const hasGas = BigNumber(this.txFeeEth).lte(this.getBalETH());
    //   const hasBalance =
    //     hasAmountToken && hasGas && this.hasValidDecimals(amount, currency);
    //   return {
    //     valid: hasBalance,
    //     msg: hasBalance
    //       ? ''
    //       : !hasAmountToken
    //       ? Vue.$i18n // TODO: figure out translations to pass tests
    //         ? Vue.$i18n.t('errorsGlobal.not-enough-to-send', {
    //             type: currency.symbol
    //           })
    //         : ''
    //       : !hasGas
    //       ? Vue.$i18n // TODO: figure out translations to pass tests
    //         ? Vue.$i18n.t('errorsGlobal.not-enough-to-send', {
    //             type: Vue.$i18n.t('common.gas.name')
    //           })
    //         : ''
    //       : Vue.$i18n // TODO: figure out translations to pass tests
    //       ? Vue.$i18n.t('errorsGlobal.invalid-value')
    //       : ''
    //   };
    // }
    // return {
    //   valid: this.hasAmount && this.hasValidDecimals(amount, currency),
    //   msg: this.hasAmount
    //     ? ''
    //     : !this.hasAmount
    //     ? Vue.$i18n // TODO: figure out translations to pass tests
    //       ? Vue.$i18n.t('errorsGlobal.not-enough-to-send', {
    //           type: this.network.type.currencyName
    //         })
    //       : ''
    //     : Vue.$i18n // TODO: figure out translations to pass tests
    //     ? Vue.$i18n.t('errorsGlobal.invalid-value')
    //     : ''
    // };
  }
  hasAmount(amount) {
    // right now amount is always returning in ETH
    return this.web3.eth
      .getBalance(this.address)
      .then(bal => toBN(bal).gte(amount));
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
  getTokenTransferABI(amount, hash) {
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
    return contract.methods.transfer(hash.toLowerCase(), amount).encodeABI();
  }
  // transaction data
  getTxData(amount, address, currency) {
    let data = '0x';
    if (this.isToken(currency) && address !== '') {
      data = this.getTokenTransferABI(amount, address);
    }
    return sanitizeHex(data);
  }
  // transaction value
  getTxValue(currency, amount) {
    if (this.isToken(currency)) {
      return '0x00';
    }
    return toHex(amount);
  }
  getTxAddress(currency, hash) {
    return this.isToken(currency)
      ? toChecksumAddress(currency.address)
      : toChecksumAddress(hash.trim());
  }
  // submit transaction
  async submitTransaction(gasLimit, address, amount, data, contractAddress) {
    try {
      const coinbase = await this.web3.eth.getCoinbase();
      const nonce = await this.web3.eth.getTransactionCount(coinbase);
      const toAddress = data === '0x' ? address : contractAddress;
      const raw = {
        nonce: toHex(nonce),
        gasLimit: toHex(gasLimit),
        to: toAddress,
        value: toHex(amount),
        data: data
      };
      const _tx = new Transaction(raw);
      const json = _tx.toJSON(true);
      json.from = coinbase;
      console.log(json);
      return this.web3.eth.sendTransaction(json);
    } catch (error) {
      return error;
    }
  }
}
