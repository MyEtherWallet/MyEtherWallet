import { toBN, toHex, toChecksumAddress, isHexStrict } from 'web3-utils';
import { isAddress } from '@/core/helpers/addressUtils';
import SanitizeHex from '@/core/helpers/sanitizeHex';
import { Transaction } from '@ethereumjs/tx';
import { useWalletStore } from '@/core/store/wallet';

import ErrorList from '../errors';
import Web3Contract from 'web3-eth-contract';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import hasValidDecimals from '@/core/helpers/hasValidDecimals.js';
import { isNull } from 'lodash';
import BigNumber from 'bignumber.js';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';

class SendTransaction {
  constructor() {
    this.currency = null;
    this.localGasPrice = '0';
    this.TX = {
      from: '0x',
      to: '0x',
      destination: '0x',
      nonce: '0x',
      gasPrice: '0x',
      gas: '0x5208', //21000
      value: '0x',
      destinationValue: '0x',
      data: '0x'
    };
  }
  setTo(_to, _type) {
    if (isAddress(_to)) {
      this.TX.destination = _to;
      this.TX.toDetails = _type;
    } else throw ErrorList.INVALID_TO_ADDRESS;
  }
  _setTo() {
    this.TX.to = this.isToken()
      ? toChecksumAddress(this.currency.contract)
      : toChecksumAddress(this.TX.destination);
  }
  setFrom(_from) {
    if (isAddress(_from)) this.TX.from = _from;
    else throw ErrorList.INVALID_FROM_ADDRESS;
  }
  _setGasPrice() {
    this.TX.gasPrice = toHex(toBN(this.localGasPrice));
  }
  setGasLimit(_gasLimit) {
    this.TX.gas = toHex(toBN(_gasLimit));
  }
  setLocalGasPrice(gasPrice) {
    this.localGasPrice = toHex(toBN(gasPrice));
  }
  setValue(_value) {
    if (isNaN(_value) || isNull(_value)) _value = 0;
    const _valueBN = new BigNumber(_value);
    if (!_valueBN.lt(0)) this.TX.destinationValue = toHex(_valueBN.toFixed());
    else throw ErrorList.NEGATIVE_VALUE;
  }
  _setValue() {
    if (this.isToken()) {
      this.TX.value = '0x00';
      this.setData(
        this.getTokenTransferABI(this.TX.destinationValue, this.TX.destination)
      );
    } else {
      this.TX.value = toHex(toBN(this.TX.destinationValue));
    }
  }
  setData(_data) {
    if (isHexStrict(_data)) this.TX.data = SanitizeHex(_data);
    else throw ErrorList.INVALID_DATA_HEX;
  }
  setNonce(_nonce) {
    this.TX.nonce = toHex(toBN(_nonce));
  }
  setCurrency(_currency) {
    this.currency = _currency;
    this.TX.data = '0x';
  }
  getEntireBal() {
    const { balance } = useWalletStore();
    if (this.isToken()) {
      return this.currency.balance;
    }
    const gasPriceBN = toBN(this.localGasPrice);
    const fee = gasPriceBN.mul(toBN(this.TX.gas));
    return balance.gt(balance.sub(fee)) ? balance.sub(fee) : 0;
  }
  txFee() {
    return toBN(this.localGasPrice).mul(toBN(this.TX.gas));
  }
  estimateGas() {
    const { web3, address } = useWalletStore();
    if (address) this.setFrom(address);
    this._setTo();
    this._setValue();
    this._setGasPrice();
    return web3.eth.estimateGas({
      data: this.TX.data,
      from: this.TX.from,
      to: this.TX.to,
      value: this.TX.value
    });
  }
  isToken() {
    return this.currency?.contract !== MAIN_TOKEN_ADDRESS;
  }
  hasEnoughBalance() {
    const amount = toBN(this.TX.destinationValue);
    const { balance } = useWalletStore();
    if (this.isToken() && this.currency.balance) {
      const hasAmountToken = amount.lte(toBNSafe(this.currency.balance));
      const hasGas = this.txFee().lte(balance);
      return hasAmountToken && hasGas;
    }
    return amount.add(this.txFee()).lte(balance);
  }
  getTokenTransferABI(amount, _toAddress) {
    amount = toBN(amount);
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
    const contract = new Web3Contract(jsonInterface);
    return contract.methods
      .transfer(_toAddress.toLowerCase(), amount)
      .encodeABI();
  }
  async submitTransaction() {
    const { web3, address } = useWalletStore();
    try {
      this._setTo();
      this._setValue();
      this._setGasPrice();
      const nonce = await web3.eth.getTransactionCount(address);
      this.setNonce(nonce);
      this.TX.gasLimit = this.TX.gas;
      const _tx = Transaction.fromTxData(this.TX);
      const json = _tx.toJSON(true);
      json.from = address;
      json.toDetails = this.TX.toDetails;
      return web3.eth.sendTransaction(json);
    } catch (e) {
      return e;
    }
  }
}
SendTransaction.helpers = {
  hasValidDecimals
};
export default SendTransaction;
