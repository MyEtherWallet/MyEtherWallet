import StakewiseHandler from './stakewiseHandler';
import { toWei } from 'web3-utils';
export default class StakewiseStakeHandler extends StakewiseHandler {
  constructor(web3, isEth, address) {
    super(web3, isEth); // initializes the contracts needed
    this.fromAddress = address;
    this.value = 0;
    this.gasLimt = '21000';
    this.gasPrice = '0';
  }

  getTransactionFee() {
    return (
      this.poolContract.methods
        // eslint-disable-next-line
        .stakeWithPartner(ETH_DONATION_ADDRESS)
        .estimateGas({
          from: this.fromAddress,
          value: this.value
        })
    );
  }

  async stake() {
    const nonce = await this.web3.eth.getTransactionCount(this.fromAddress);
    return (
      this.poolContract.methods
        // eslint-disable-next-line
        .stakeWithPartner(ETH_DONATION_ADDRESS)
        .send({
          from: this.fromAddress,
          value: this.value,
          gas: this.gasLimit,
          gasPrice: this.gasPrice,
          nonce: nonce
        })
    );
  }

  _setAmount(val) {
    this.value = toWei(val);
  }

  _setGasLimit(val) {
    this.gasLimit = val;
  }

  _setGasPrice(val) {
    this.gasLimit = val;
  }
}
