import BigNumber from 'bignumber.js';
import rewardsAbi from './abi/rewardEthToken';
import stakedAbi from './abi/stakedEthToken';
import { SETH2_CONTRACT, RETH2_CONTRACT, POOL_API } from './configs';

export default class StakewiseHandler {
  constructor(web3) {
    this.rewardsContract = new web3.eth.Contract(rewardsAbi, RETH2_CONTRACT);
    this.stakedContract = new web3.eth.Contract(stakedAbi, SETH2_CONTRACT);
  }

  getEthPool() {
    return this.stakedContract.methods.totalSupply().call();
  }

  getStakingFee() {
    return this.rewardsContract.methods.protocolFee().call();
  }

  getValidatorApr() {
    return new Promise((resolve, reject) => {
      fetch(POOL_API)
        .then(res => {
          return res.json();
        })
        .then(res => {
          const val = res.validators_apr;
          // netFee = val - (val * (10/100))
          const netFee = BigNumber(val).minus(
            BigNumber(val).times(BigNumber(10).div(100))
          );
          resolve(netFee.toString());
        })
        .catch(reject);
    });
  }
}
