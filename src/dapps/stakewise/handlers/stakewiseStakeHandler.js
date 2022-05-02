import StakewiseHandler from './stakewiseHandler';
import { toWei } from 'web3-utils';
import hasValidDecimals from '@/core/helpers/hasValidDecimals';
import { MEW_REFERRAL_ADDRESS } from './configs';
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
      this.poolContract.methods
        // eslint-disable-next-line
        .stakeWithReferrerOnBehalf(MEW_REFERRAL_ADDRESS, this.fromAddress)
        .estimateGas({
          from: this.fromAddress,
          value: this.value
        })
    );
  }

  stake() {
    return (
      this.poolContract.methods
        // eslint-disable-next-line
        .stakeWithReferrerOnBehalf(MEW_REFERRAL_ADDRESS, this.fromAddress)
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
    this.gasPrice = val;
  }
}

StakewiseStakeHandler.helpers = {
  hasValidDecimals
};

export default StakewiseStakeHandler;
