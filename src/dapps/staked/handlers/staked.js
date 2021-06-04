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
import EventEmitter from 'events';

export default class Staked extends EventEmitter {
  constructor() {
    super();
    try {
      this.$store = vuexStore;
      Object.assign(this, mapState('wallet', ['balance', 'web3', 'address']));
      Object.assign(this, mapGetters('global', ['network', 'gasPrice']));
      const stakedLogo = '';
      this.settingUp = true;
      this.transactionInProgress = false;
      this.myValidators = [];
      this.priorValidators = [];
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
      this.networkName = this.network().type.name;
      this.steps = [
        {
          name: 1,
          // title: this.$t('dappsStaked.steps.1'),
          completed: false
        },
        {
          name: 2,
          // title: this.$t('dappsStaked.steps.2'),
          completed: false
        },
        {
          name: 3,
          // title: this.$t('dappsStaked.steps.3'),
          completed: false
        },
        {
          name: 4,
          // title: this.$t('dappsStaked.steps.4'),
          completed: false
        },
        {
          name: 5,
          // title: this.$t('dappsStaked.steps.5'),
          completed: false
        }
      ];
    } catch (e) {
      console.log(e); // todo remove dev item
    }
    this.setup();
  }

  validatorsCount() {
    if (this.details.amount) {
      return new BigNumber(this.details.amount).dividedBy(32).toFixed();
    }
    return 0;
  }

  getValidators() {
    this.loadingValidators = true;
    return (
      axios
        .get(`${this.endpoint}/history?address=${this.address()}`, {
          header: {
            'Content-Type': 'application/json'
          }
        })
        // return axios
        //   .get(`${this.endpoint}/history?address=0xed561e40A66e791988977c21fDC7f083E9Bf24B0`, {
        //     header: {
        //       'Content-Type': 'application/json'
        //     }
        //   })
        .then(resp => {
          this.myValidators = resp.data;
          if (this.settingUp) {
            this.priorValidators = resp.data;
          }
          this.loadingValidators = false;
          this.emit('myValidators', resp.data);
          return resp;
        })
        .catch(err => {
          this.loadingValidators = false;
          this.myValidators = [];
          if (this.settingUp) {
            this.priorValidators = [];
          }
          this.emit('myValidators', []);
          if (
            err.response &&
            err.response.status === 404 &&
            err.response.data.msg === 'No matching history found'
          ) {
            return err;
          }
          // Toast(err, {}, ERROR);
          return err;
        })
    );
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
    try {
      this.eth2ContractAddress =
        stakeConfigs.network[this.networkName].depositAddress;
      this.endpoint = stakeConfigs.network[this.networkName].endpoint;
      this.batchContract = stakeConfigs.network[this.networkName].batchContract;

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
      this.getValidators().then(() => {
        this.settingUp = false;
      });
    } catch (e) {
      // eslint-disable-next-line
            console.error(e);
    }
  }
  allValidatorsStaked() {
    const validatorStaked = this.details.amount / 32;
    return this.priorValidators.length + validatorStaked;
  }
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
            console.log('response.data', response.data); // todo remove dev item
            const validatorStaked = this.details.amount / 32;
            this.setData({
              key: 'currentValidatorsStaked',
              value: validatorStaked
            });
            this.setData({ key: 'totalValidators', value: validatorStaked });
            // this.emit('done');
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
            console.log('err.response', err.response); // todo remove dev item
            this.setData({
              key: 'currentValidatorsStaked',
              value: err.response.data.current
            });
            this.setData({
              key: 'totalValidators',
              value: err.response.data.total
            });

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
    if (!this.transactionInProgress) {
      console.log('SENDING========================'); // todo remove dev item
      this.transactionInProgress = true;
      this.transactionData.from = this.address();
      this.transactionData.to = this.batchContract;
      this.transactionData.gasPrice = new BigNumber(
        this.web3().utils.toWei(this.gasPrice(), 'gwei')
      ).toFixed();
      console.log(this.transactionData); // todo remove dev item
      this.web3()
        .eth.sendTransaction(this.transactionData)
        .on('transactionHash', res => {
          this.emit('txHash', res);
          this.txHash = res;
        })
        .catch(err => {
          Toast(err, {}, ERROR);
        });
    }
  }
  setData(data) {
    // if (this.details.hasOwnProperty(data.key)) {
    //   this.details[data.key] = data.value;
    // } else {
    //   this.$set(this.details, data.key, data.value);
    // }
    console.log('details internal', this.details); // todo remove dev item
    this.emit('setData', data);
    this.details[data.key] = data.value;
    return this.details;
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
