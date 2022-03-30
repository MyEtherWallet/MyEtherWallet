import StakewiseHandler from './stakewiseHandler';
import { toWei } from 'web3-utils';
import hasValidDecimals from '@/core/helpers/hasValidDecimals';
class StakewiseStakeHandler extends StakewiseHandler {
  constructor(web3, isEth, address) {
    super(web3, isEth); // initializes the contracts needed
    this.fromAddress = address;
    this.value = 0;
    this.gasLimt = '21000';
    this.gasPrice = '0';
    this.web3 = web3;
  }

  getTransactionFee() {
    return (
      this.mewProxyContract.methods
        // eslint-disable-next-line
        .stakeWithPartnerOnBehalf(this.fromAddress, this.poolAddress)
        .estimateGas({
          from: this.fromAddress,
          value: this.value
        })
    );
  }

  stake() {
    return (
      this.mewProxyContract.methods
        // eslint-disable-next-line
        .stakeWithPartnerOnBehalf(this.fromAddress, this.poolAddress)
        .send({
          from: this.fromAddress,
          value: this.value,
          gas: this.gasLimit,
          gasPrice: this.gasPrice
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

StakewiseStakeHandler.helpers = {
  hasValidDecimals
};

export default StakewiseStakeHandler;
