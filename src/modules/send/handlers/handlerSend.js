import { toBN, toHex, toChecksumAddress, isHexStrict } from 'web3-utils';
import { isAddress } from '@/core/helpers/addressUtils';
import SanitizeHex from '@/core/helpers/sanitizeHex';
import { Transaction } from 'ethereumjs-tx';
import { mapState, mapGetters } from 'vuex';
import vuexStore from '@/core/store';
import ErrorList from '../errors';
import Web3Contract from 'web3-eth-contract';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';

class SendTransaction {
  constructor() {
    this.$store = vuexStore;
    Object.assign(this, mapState('wallet', ['balance', 'web3', 'address']));
    Object.assign(this, mapGetters('global', ['network', 'gasPrice']));
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
    this.TX.gasPrice =
      this.localGasPrice === '0'
        ? toHex(toBN(this.gasPrice()))
        : toHex(toBN(this.localGasPrice));
  }
  setGasLimit(_gasLimit) {
    this.TX.gas = toHex(toBN(_gasLimit));
  }
  setLocalGasPrice(gasPrice) {
    this.localGasPrice = toHex(toBN(gasPrice));
  }
  setValue(_value) {
    const _valueBN = toBN(_value);
    if (!_valueBN.ltn(0)) this.TX.destinationValue = toHex(_valueBN);
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
    if (this.isToken()) {
      return this.currency.balance;
    }
    const gasPriceBN = toBN(this.gasPrice());
    const fee = gasPriceBN.mul(toBN(this.TX.gas));
    return this.balance().gt(this.balance().sub(fee)) > 0
      ? this.balance().sub(fee)
      : 0;
  }
  txFee() {
    return toBN(this.gasPrice()).mul(toBN(this.TX.gas));
  }
  estimateGas() {
    this.setFrom(this.address());
    this._setTo();
    this._setValue();
    this._setGasPrice();
    return this.web3().eth.estimateGas({
      data: this.TX.data,
      from: this.TX.from,
      to: this.TX.to,
      value: this.TX.value,
      gasPrice: this.TX.gasPrice
    });
  }
  isToken() {
    return this.currency?.contract !== MAIN_TOKEN_ADDRESS;
  }
  hasEnoughBalance() {
    const amount = toBN(this.TX.destinationValue);
    if (this.isToken() && this.currency.balance) {
      const hasAmountToken = amount.lte(toBN(this.currency.balance));
      const hasGas = this.txFee().lte(this.balance());
      return hasAmountToken && hasGas;
    }
    return amount.add(this.txFee()).lte(this.balance());
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
    try {
      this._setTo();
      this._setValue();
      this._setGasPrice();
      const nonce = await this.web3().eth.getTransactionCount(this.address());
      this.setNonce(nonce);
      const _tx = new Transaction(this.TX);
      const json = _tx.toJSON(true);
      json.from = this.address();
      json.toDetails = this.TX.toDetails;
      return this.web3().eth.sendTransaction(json);
    } catch (e) {
      return e;
    }
  }
}
SendTransaction.helpers = {
  hasValidDecimals(amountStr, numDecimals) {
    const decimals = amountStr.split('.')[1];
    if (!decimals) return true;
    return decimals.length <= numDecimals;
  }
};
export default SendTransaction;
