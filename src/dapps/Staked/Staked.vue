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
          :to="{ path: '/generate-address' }"
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

const eth2ContractAddress = '0x00000000219ab540356cBB839Cbe05303d7705Fa';

export default {
  components: {
    backButton,
    stepper
  },
  data() {
    return {
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
        }
      ]
    };
  },
  computed: {
    ...mapState('main', ['account', 'web3']),
    validatorsCount() {
      if (this.details.amount) {
        return new BigNumber(this.details.amount).dividedBy(32).toFixed();
      }
      return 0;
    }
  },
  mounted() {
    this.apr = new BigNumber(calculateEth2Rewards({})).times(100).toFixed(2);
    this.web3.eth
      .getBalance(eth2ContractAddress.toLowerCase())
      .then(res => {
        const raw = this.web3.utils.fromWei(res);
        this.totalStaked = new BigNumber(raw).toFormat(0);
      })
      .catch(err => {
        Toast.responseHandler(err, Toast.ERROR);
      });
  },
  methods: {
    goToGenerate() {
      this.$router.push('/generate-address');
    },
    startProvision() {
      const params = {
        address: this.account.address,
        withdrawalKey: this.details.address,
        validatorsCount: this.validatorsCount
      };
      axios
        .post('https://staked.mewwallet.dev/provision', params, {
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
          console.log('response', response);
        })
        .catch(err => {
          console.error('err', err);
          Toast.responseHandler(err, Toast.ERROR);
        });
    },
    startPolling(id) {
      console.error('id', id)
      const interval = setInterval(() => {
        axios
          .get(
            'https://staked.mewwallet.dev/status',
            {
              provisioning_request_uuid: id
            },
            {
              header: {
                'Content-Type': 'application/json'
              }
            }
          )
          .then(response => {
            console.log('response', response);
            clearInterval(interval);
          })
          .catch(err => {
            console.error('err', err);
            Toast.responseHandler(err, Toast.ERROR);
          });
      }, 5000);
    },
    sendTransaction(data) {
      this.web3.eth
        .sendTransaction({
          from: this.account.address,
          // to: LEND_ADDRESS,
          value: 0,
          gas: 100000,
          data: data
        })
        .catch(err => {
          Toast.responseHandler(err, Toast.ERROR);
        });
    },
    setData(data) {
      this.details[data.key] = data.value;
      if (data.key === 'review' && data.value === true) {
        console.error('in here')
        this.startProvision();
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
