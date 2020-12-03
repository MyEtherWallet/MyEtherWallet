<template>
  <div class="staked-wrapper">
    <div class="header-container d-flex">
      <back-button class="button-container" :title="$t('common.exit-dapp')">
        <template v-slot:right>
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
    <div class="about-container">
      <img :src="stakedLogo" height="20px" alt="Staked Logo" />
      <p class="pt-2">{{ $t('dappsStaked.about') }}</p>
    </div>
    <stepper
      :steps="steps"
      :details="details"
      :set-data="setData"
      @complete-step="completeStep"
      @active-step="isStepActive"
      @stakeEth2="startProvision"
      @sendTransaction="sendTransaction"
    />
    <div
      v-if="currentStepIdx === 0 || currentStepIdx === 1"
      class="footer d-flex pb-5"
    >
      <i18n path="dappsStaked.what-is-eth2">
        <!-- need to add link -->
        <span slot="learn-more" class="learn">{{
          $t('common.learn-more')
        }}</span>
      </i18n>
      <i18n path="dappsStaked.do-not-have-eth2">
        <!-- need to add link -->
        <router-link
          slot="generate"
          class="generate"
          :to="{ path: '/generate-eth2-keystore' }"
          target="_blank"
        >
          {{ $t('dappsStaked.generate') }}
        </router-link>
      </i18n>
    </div>
    <div v-if="currentStepIdx === 0" class="warning-container d-flex">
      <div><i class="fa fa-exclamation-triangle" /></div>
      <div>
        <span>{{ $t('dappsStaked.generate-address.attention') }}</span>
        <p class="warning mt-2">{{ $t('dappsStaked.warning') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
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
    stepper
  },
  data() {
    return {
      transactionData: {},
      eth2ContractAddress: '',
      endpoint: '',
      batchContract: '',
      details: {},
      currentStepIdx: 0,
      totalStaked: '',
      stakedLogo: stakedLogo,
      apr: '',
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
  mounted() {
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
  },
  methods: {
    goToGenerate() {
      this.$router.push('/generate-eth2-keystore');
    },
    startProvision() {
      const params = {
        address: this.account.address,
        withdrawalKey: this.details.address,
        validatorsCount: this.validatorsCount
      };
      axios
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
      const interval = setInterval(() => {
        axios
          .get(`${this.endpoint}/status?provisioning_request_uuid=${uuid}`, {
            header: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            if (
              response &&
              response.data &&
              response.data.raw.length === parseInt(this.validatorsCount)
            ) {
              this.details.currentValidatorsStaked = this.details.amount / 32;
              this.details.totalValidators = this.details.amount / 32;
              this.transactionData = response.data.transaction;
              clearInterval(interval);
            }
          })
          .catch(err => {
            if (
              err.response &&
              err.response.status === 424 &&
              err.response.data.msg ===
                'Not all validators have been provisioned'
            ) {
              this.details.currentValidatorsStaked = err.response.data.current;
              this.details.totalValidators = err.response.data.total;
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
      this.web3.eth.sendTransaction(this.transactionData).catch(err => {
        Toast.responseHandler(err, Toast.ERROR);
      });
    },
    setData(data) {
      this.details[data.key] = data.value;
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
