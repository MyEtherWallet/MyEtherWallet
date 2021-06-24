import axios from 'axios';
import BigNumber from 'bignumber.js';
import configs from './configs';
import calculateEth2Rewards from './helpers';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
// import EventEmitter from 'events';

export default class Staked {
  constructor(web3, network) {
    /**
     * set up the variables
     */
    this.web3 = web3;
    this.network = network;
    this.totalStaked = '';
    this.apr = '';
    /**
     * get the total staked and apr
     */
    this.setup();
  }
  /**
   * Get the Total Staked and APR
   */
  setup() {
    this.eth2ContractAddress =
      configs.network[this.network.type.name].depositAddress;
    this.endpoint = configs.network[this.network.type.name].endpoint;
    this.batchContract = configs.network[this.network.type.name].batchContract;

    this.web3.eth
      .getBalance(this.eth2ContractAddress)
      .then(res => {
        const raw = this.web3.utils.fromWei(res, 'ether');
        this.totalStaked = new BigNumber(raw).toFormat(0);
        this.apr = new BigNumber(calculateEth2Rewards({ totalAtStake: raw }))
          .times(100)
          .toFixed(2);
      })
      .catch(err => {
        Toast(err, {}, ERROR);
      });
    // this.getValidators().then(() => {
    //   this.settingUp = false;
    // });
  }
  getTotalStakedAndApr() {
    return {
      totalStaked: this.totalStaked,
      apr: this.apr
    };
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
