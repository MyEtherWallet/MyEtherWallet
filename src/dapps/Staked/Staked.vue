<template>
  <div class="staked-wrapper">
    <div class="header-container d-flex">
      <back-button class="button-container" :title="$t('common.exit-dapp')">
        <template #center>
          <div class="d-flex">
            <div
              :class="['tab-btn', !activeValidatorsTab ? 'active-tab' : '']"
              @click="activeValidatorsTab = !activeValidatorsTab"
            >
              {{ $tc('dappsStaked.stake') }}
            </div>
            <div
              :class="[
                'tab-btn',
                'validators-btn',
                activeValidatorsTab ? 'active-tab' : ''
              ]"
              @click="activeValidatorsTab = !activeValidatorsTab"
            >
              {{ $t('dappsStaked.status') }}
            </div>
          </div>
        </template>
        <template #right>
          <div class="d-flex stats-wrapper">
            <div class="d-flex stats-container">
              <i
                v-if="!apr"
                class="fa fa-spinner fa-spin staking-percent mb-1"
              />
              <span v-if="apr" class="staking-percent">{{ apr }}%</span>
              <span>{{ $t('dappsStaked.current-stake-title') }}</span>
            </div>
            <div class="d-flex stats-container px-3">
              <i
                v-if="!totalStaked"
                class="fa fa-spinner fa-spin total-eth-percent mb-1"
              />
              <span v-if="totalStaked" class="total-eth-percent">{{
                totalStaked
              }}</span>
              <span>{{ $t('dappsStaked.total-eth-title') }}</span>
            </div>
          </div>
        </template>
      </back-button>
    </div>
    <div v-if="!activeValidatorsTab">
      <div class="about-container">
        <img :src="stakedLogo" height="20px" alt="Staked Logo" />
        <p class="pt-2">{{ $t('dappsStaked.about') }}</p>
      </div>
      <stepper
        :steps="steps"
        :details="details"
        :set-data="setData"
        :tx-hash="txHash"
        :reset-stepper="resetStepper"
        @complete-step="completeStep"
        @active-step="isStepActive"
        @stakeEth2="startProvision"
        @sendTransaction="sendTransaction"
        @reset="reset"
        @resetStepperDone="resetStepperDone"
      />

      <div v-if="currentStepIdx === 0" class="warning-container d-flex">
        <div><i class="fa fa-exclamation-triangle" /></div>
        <div>
          <span>{{ $t('dappsStaked.generate-address.attention') }}</span>
          <p class="warning mt-2">{{ $t('dappsStaked.warning') }}</p>
        </div>
      </div>
    </div>
    <staked-status
      v-if="activeValidatorsTab"
      :network="network.type.name"
      :loading="loadingValidators"
      :validators="myValidators"
    />
  </div>
</template>

<script>
import stakedStatus from './containers/Status/Status';
import backButton from '@/layouts/InterfaceLayout/components/BackButton';
import stakedLogo from '@/assets/images/icons/dapps/staked.png';
import stepper from './components/Stepper/Stepper';
import axios from 'axios';
import calculateEth2Rewards from './helpers/calculateRewards';
import BigNumber from 'bignumber.js';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import stakeConfigs from './configs';
export default {
  components: {
    backButton,
    stepper,
    stakedStatus
  },
  data() {
    return {
      myValidators: [],
      transactionData: {},
      details: {},
      totalStaked: '',
      apr: '',
      eth2ContractAddress: '',
      endpoint: '',
      batchContract: '',
      txHash: '',
      currentStepIdx: 0,
      resetStepper: false,
      stakedLogo: stakedLogo,
      loadingValidators: true,
      activeValidatorsTab: false,
      steps: [
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
      ]
    };
  },
  computed: {
    ...mapState('main', ['account', 'web3', 'gasPrice', 'network']),
    validatorsCount() {
      if (this.details.amount) {
        return new BigNumber(this.details.amount).dividedBy(32).toFixed();
      }
      return 0;
    }
  },
  watch: {
    web3() {
      this.reset();
    },
    network: {
      deep: true,
      immediate: true,
      handler: function (newVal, oldVal) {
        if (newVal && oldVal && newVal !== oldVal) {
          if (newVal.type.name === oldVal.type.name) {
            this.resetStepper = true;
          }
          if (newVal.service !== oldVal.service) {
            this.resetStepper = true;
          }
        }
      }
    }
  },
  mounted() {
    this.setup();
  },
  methods: {
    async getValidators() {
      this.loadingValidators = true;
      await axios
        .get(`${this.endpoint}/history?address=${this.account.address}`, {
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
          Toast.responseHandler(err, Toast.ERROR);
        });
    },
    resetStepperDone() {
      this.resetStepper = false;
    },
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
    },
    setup() {
      this.eth2ContractAddress =
        stakeConfigs.network[this.network.type.name].depositAddress;
      this.endpoint = stakeConfigs.network[this.network.type.name].endpoint;
      this.batchContract =
        stakeConfigs.network[this.network.type.name].batchContract;

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
          Toast.responseHandler(err, Toast.ERROR);
        });
      this.getValidators();
    },
    goToGenerate() {
      this.$router.push('/generate-eth2-keystore');
    },
    async startProvision() {
      const params = {
        address: this.account.address,
        withdrawalKey: this.details.address,
        validatorsCount: this.validatorsCount
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
            : Toast.responseHandler(
                this.$t('dappsStaked.error-try-again'),
                Toast.ERROR
              );
        })
        .catch(err => {
          Toast.responseHandler(err, Toast.ERROR);
        });
    },
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
              response.data.raw.length === parseInt(this.validatorsCount)
            ) {
              const validatorStaked = this.details.amount / 32;
              if (this.details.hasOwnProperty('currentValidatorsStaked')) {
                this.details.currentValidatorsStaked = validatorStaked;
              } else {
                this.$set(
                  this.details,
                  'currentValidatorsStaked',
                  validatorStaked
                );
              }

              if (this.details.hasOwnProperty('totalValidators')) {
                this.details.totalValidators = validatorStaked;
              } else {
                this.$set(this.details, 'totalValidators', validatorStaked);
              }
              this.transactionData = response.data.transaction;
              clearInterval(interval);
            }
          })
          .catch(err => {
            prevReqComplete = true;
            if (
              err.response &&
              err.response.status === 424 &&
              err.response.data.msg ===
                'Not all validators have been provisioned'
            ) {
              if (this.details.hasOwnProperty('currentValidatorsStaked')) {
                this.details.currentValidatorsStaked =
                  err.response.data.current;
              } else {
                this.$set(
                  this.details,
                  'currentValidatorsStaked',
                  err.response.data.current
                );
              }

              if (this.details.hasOwnProperty('totalValidators')) {
                this.details.totalValidators = err.response.data.total;
              } else {
                this.$set(
                  this.details,
                  'totalValidators',
                  err.response.data.total
                );
              }

              return;
            }
            if (
              err.response &&
              err.response.status === 404 &&
              err.response.data.msg ===
                'Requested provisioning_request_uuid not found'
            )
              return;
            Toast.responseHandler(err, Toast.ERROR);
          });
      }, 5000);
    },
    sendTransaction() {
      this.transactionData.from = this.account.address;
      this.transactionData.to = this.batchContract;
      this.transactionData.gasPrice = new BigNumber(
        this.web3.utils.toWei(this.gasPrice, 'gwei')
      ).toFixed();
      this.web3.eth
        .sendTransaction(this.transactionData)
        .on('transactionHash', res => {
          this.txHash = res;
        })
        .catch(err => {
          Toast.responseHandler(err, Toast.ERROR);
        });
    },
    setData(data) {
      if (this.details.hasOwnProperty(data.key)) {
        this.details[data.key] = data.value;
      } else {
        this.$set(this.details, data.key, data.value);
      }
    },
    completeStep(payload) {
      this.steps.forEach(step => {
        if (step.name === payload.name) {
          step.completed = true;
        }
      });
    },
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
};
</script>

<style lang="scss" scoped>
@import 'Staked.scss';
</style>
