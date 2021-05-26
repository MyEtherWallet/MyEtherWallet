import axios from 'axios';
import BigNumber from 'bignumber.js';
import { mapGetters, mapState } from 'vuex';
import stakeConfigs from './configs';
import calculateEth2Rewards from './helpers';
import {
  Toast,
  WARNING,
  ERROR,
  SENTRY
} from '@/modules/toast/handler/handlerToast';
import vuexStore from '@/core/store';

export default class Staked {
  constructor() {
    this.$store = vuexStore;
    Object.assign(this, mapState('wallet', ['balance', 'web3', 'address']));
    Object.assign(this, mapGetters('global', ['network', 'gasPrice']));
    const stakedLogo = '';
    this.myValidators = [];
    this.transactionData = {};
    this.details = {};
    this.totalStaked = '';
    this.apr = '';
    this.eth2ContractAddress = '';
    this.endpoint = '';
    this.batchContract = '';
    this.txHash = '';
    this.currentStepIdx = 0;
    this.resetStepper = false;
    this.stakedLogo = stakedLogo;
    this.loadingValidators = true;
    this.activeValidatorsTab = false;
    this.steps = [
      {
        name: 1,
        title: this.$t('dappsStaked.steps.1'),
        completed: false
      },
      {
        name: 2,
        title: this.$t('dappsStaked.steps.2'),
        completed: false
      },
      {
        name: 3,
        title: this.$t('dappsStaked.steps.3'),
        completed: false
      },
      {
        name: 4,
        title: this.$t('dappsStaked.steps.4'),
        completed: false
      },
      {
        name: 5,
        title: this.$t('dappsStaked.steps.5'),
        completed: false
      }
    ];
  }

  validatorsCount() {
    if (this.details.amount) {
      return new BigNumber(this.details.amount).dividedBy(32).toFixed();
    }
    return 0;
  }

  async getValidators() {
    this.loadingValidators = true;
    await axios
      .get(`${this.endpoint}/history?address=${this.address()}`, {
        header: {
          'Content-Type': 'application/json'
        }
      })
      .then(resp => {
        this.myValidators = resp.data;
        this.loadingValidators = false;
      })
      .catch(err => {
        this.loadingValidators = false;
        this.myValidators = [];
        if (
          err.response &&
          err.response.status === 404 &&
          err.response.data.msg === 'No matching history found'
        ) {
          return;
        }
        Toast(err, {}, ERROR);
      });
  }
  resetStepperDone() {
    this.resetStepper = false;
  }
  reset() {
    this.transactionData = {};
    this.details = {};
    this.totalStaked = '';
    this.apr = '';
    this.resetStepper = true;
    this.eth2ContractAddress = '';
    this.endpoint = '';
    this.batchContract = '';
    this.setup();
  }
  setup() {
    this.eth2ContractAddress =
      stakeConfigs.network[this.network().type.name].depositAddress;
    this.endpoint = stakeConfigs.network[this.network().type.name].endpoint;
    this.batchContract =
      stakeConfigs.network[this.network().type.name].batchContract;

    this.web3()
      .eth.getBalance(this.eth2ContractAddress)
      .then(res => {
        const raw = this.web3().utils.fromWei(res, 'ether');
        this.totalStaked = new BigNumber(raw).toFormat(0);
        this.apr = new BigNumber(calculateEth2Rewards({ totalAtStake: raw }))
          .times(100)
          .toFixed(2);
      })
      .catch(err => {
        Toast(err, {}, ERROR);
      });
    this.getValidators();
  }
  // goToGenerate() {
  //   this.$router.push('/generate-eth2-keystore');
  // }
  async startProvision() {
    const params = {
      address: this.address(),
      withdrawalKey: this.details.address,
      validatorsCount: this.validatorsCount()
    };
    await axios
      .post(this.endpoint + '/provision', params, {
        header: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        response && response.data.provisioning_request_uuid
          ? this.startPolling(response.data.provisioning_request_uuid)
          : Toast(this.$t('dappsStaked.error-try-again'), {}, ERROR);
      })
      .catch(err => {
        Toast(err, {}, ERROR);
      });
  }
  startPolling(uuid) {
    let prevReqComplete = true;
    const interval = setInterval(() => {
      if (!prevReqComplete) return;
      prevReqComplete = false;
      axios
        .get(`${this.endpoint}/status?provisioning_request_uuid=${uuid}`, {
          header: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          prevReqComplete = true;
          if (
            response &&
            response.data &&
            response.data.raw.length === parseInt(this.validatorsCount())
          ) {
            const validatorStaked = this.details.amount / 32;
            // if (this.details.hasOwnProperty('currentValidatorsStaked')) {
            //   this.details.currentValidatorsStaked = validatorStaked;
            // } else {
            //   this.$set(
            //     this.details,
            //     'currentValidatorsStaked',
            //     validatorStaked
            //   );
            // }
            //
            // if (this.details.hasOwnProperty('totalValidators')) {
            //   this.details.totalValidators = validatorStaked;
            // } else {
            //   this.$set(this.details, 'totalValidators', validatorStaked);
            // }
            this.details.currentValidatorsStaked = validatorStaked;
            this.details.totalValidators = validatorStaked;
            this.transactionData = response.data.transaction;
            clearInterval(interval);
          }
        })
        .catch(err => {
          prevReqComplete = true;
          if (
            err.response &&
            err.response.status === 424 &&
            err.response.data.msg === 'Not all validators have been provisioned'
          ) {
            this.details.currentValidatorsStaked = err.response.data.current;
            // if (this.details.hasOwnProperty('currentValidatorsStaked')) {
            //   this.details.currentValidatorsStaked = err.response.data.current;
            // } else {
            //
            //   this.$set(
            //     this.details,
            //     'currentValidatorsStaked',
            //     err.response.data.current
            //   );
            // }
            this.details.totalValidators = err.response.data.total;
            // if (this.details.hasOwnProperty('totalValidators')) {
            //   this.details.totalValidators = err.response.data.total;
            // } else {
            //   this.$set(
            //     this.details,
            //     'totalValidators',
            //     err.response.data.total
            //   );
            // }

            return;
          }
          if (
            err.response &&
            err.response.status === 404 &&
            err.response.data.msg ===
              'Requested provisioning_request_uuid not found'
          )
            return;
          Toast(err, {}, ERROR);
        });
    }, 5000);
  }
  sendTransaction() {
    // this.transactionData.from = this.address();
    // this.transactionData.to = this.batchContract;
    // this.transactionData.gasPrice = new BigNumber(
    //   this.web3().utils.toWei(this.gasPrice(), 'gwei')
    // ).toFixed();
    // this.web3()
    //   .eth.sendTransaction(this.transactionData)
    //   .on('transactionHash', res => {
    //     this.txHash = res;
    //   })
    //   .catch(err => {
    //     Toast(err, {}, ERROR);
    //   });
  }
  setData(data) {
    this.details[data.key] = data.value;
  }
  completeStep(payload) {
    this.steps.forEach(step => {
      if (step.name === payload.name) {
        step.completed = true;
      }
    });
  }
  isStepActive(payload) {
    this.currentStepIdx = payload.index;
    this.steps.forEach(step => {
      if (step.name === payload.name) {
        if (step.completed === true) {
          step.completed = false;
        }
      }
    });
  }
}
