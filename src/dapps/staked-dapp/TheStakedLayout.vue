<template>
  <!--
    ===================================================
    The Staked Layout
    ===================================================
    -->
  <the-wrapper-dapp
    :has-exit-btn="true"
    :banner-img="stakedLogo"
    :title-icon="titleIcon"
    :banner-text="header"
    :tab-items="tabs"
    :active-tab="activeTab"
    top-strip
  >
    <!--
    ===================================================
    The Staked Header/Banner
    ===================================================
    -->
    <template #HeaderBody>
      <v-divider class="textPrimary" />
      <div class="d-flex flex-wrap align-center justify-center">
        <div class="text-uppercase textPrimary--text font-weight-bold">
          Total Staked:
          <span class="primary--text">{{ totalStaked }}</span>
        </div>
        <v-icon color="textPrimary">mdi-circle-medium</v-icon>
        <div class="text-uppercase textPrimary--text font-weight-bold">
          Current APR: <span class="primary--text">{{ currentAPR }}</span>
        </div>
      </div>
      <div class="d-flex align-center justify-center mt-3">
        <v-btn-toggle
          v-model="activeTab"
          mandatory
          borderless
          active-class="active-btn"
          background-color="transparent"
        >
          <v-btn
            class="px-md-9 white--text text-transform--initial"
            color="#00182c"
          >
            New stake
          </v-btn>
          <v-btn
            class="px-md-9 white--text text-transform--initial"
            color="#00182c"
          >
            <div>
              <div class="white--text font-weight-medium">My stake</div>
              <div class="mew-label textPrimary--text font-weight-bold">
                32.245234 ETH
              </div>
            </div>
          </v-btn>
        </v-btn-toggle>
      </div>
    </template>

    <template #HeaderRight>
      <div class="text-right">
        <a
          href="https://kb.myetherwallet.com/en/dapps/stake-eth2-web/#:~:text=MEW%20has%20integrated%20Staked.us,least%2032%20ETH%20to%20stake."
          target="_blank"
          class="primary--text font-weight-medium text-right"
        >
          New to staking? Learn more
          <v-icon class="ml-1" small color="primary">mdi-open-in-new</v-icon>
        </a>
      </div>
    </template>

    <!--
    ===================================================
    New Stake Tab
    ===================================================
    -->
    <template #tabContent1>
      <v-sheet
        min-height="500px"
        max-width="700px"
        color="transparent"
        class="mx-auto"
      >
        <staked-stepper :current-apr="currentAPR" />
      </v-sheet>
    </template>
    <!--
    ===================================================
    My Stake tab
    ===================================================
    -->
    <template #tabContent2>
      <v-sheet
        min-height="500px"
        max-width="700px"
        color="transparent"
        class="py-15 mx-auto"
      >
        <div class="mb-5">
          <div class="mew-heading-2 mb-8 ml-2">
            {{ $t('ens.search-domain') }}
          </div>
          <v-row class="mx-0">
            <v-col class="pr-0" cols="12">
              <status
                :validators="myValidators"
                :loading="loadingValidators"
              ></status>
            </v-col>
          </v-row>
        </div>
      </v-sheet>
    </template>
  </the-wrapper-dapp>
</template>

<script>
import titleIcon from '@/assets/images/icons/icon-colorful-eth.svg';
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
import handlerStaked from './handlers/handlerStaked';
import stakedLogo from '@/assets/images/backgrounds/bg-dapps-stake.svg';
import { mapGetters, mapState } from 'vuex';
import StakedStepper from './components/staked-stepper/StakedStepper';
import status from './components/status/Status';

export default {
  name: 'TheStakedLayout',
  components: {
    TheWrapperDapp,
    StakedStepper,
    status
  },
  data() {
    return {
      titleIcon: titleIcon,
      header: {
        title: 'Ethereum 2.0 staking',
        subtext:
          'Stake on Ethereum 2.0 and earn continuous rewards for providing a public good to the community.',
        subtextClass: 'textPrimary--text'
      },
      activeTab: 0,
      handlerStaked: {},
      myValidators: [],
      transactionData: {},
      details: {},
      apr: '',
      eth2ContractAddress: '',
      endpoint: '',
      batchContract: '',
      txHash: '',
      resetStepper: false,
      stakedLogo: stakedLogo,
      loadingValidators: true,
      tabs: [{ name: 'stake' }, { name: 'status' }]
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'web3', 'address']),
    ...mapGetters('global', ['network', 'gasPrice']),
    /**
     * Total Staked
     * @returns string
     */
    totalStaked() {
      return this.handlerStaked.totalStaked + ' ETH';
    },
    /**
     * Current APR
     * @returns string
     */
    currentAPR() {
      return this.handlerStaked.apr;
    }
  },
  watch: {
    resetStepper: {
      handler: function (val) {
        if (val === true) {
          this.init();
          this.previousStep = {};
          this.$emit('resetStepperDone');
        }
      },
      deep: true,
      immediate: true
    },
    txHash(val) {
      console.log('txhash watcher', val); // todo remove dev item
      if (val && val !== '') {
        this.nextStepAction();
      }
    }
  },
  mounted() {
    /**
     * Initiate Stake Handler
     */
    this.handlerStaked = new handlerStaked(
      this.web3,
      this.network,
      this.address
    );
  },
  methods: {
    validatorsCount() {
      return this.handlerStaked.validatorsCount();
    },
    resetStepperDone() {
      this.resetStepper = false;
    },
    reset() {
      this.transactionData = {};
      this.details = {};
      this.apr = '';
      this.resetStepper = true;
      this.eth2ContractAddress = '';
      this.endpoint = '';
      this.batchContract = '';
      this.handlerStaked.reset();
    },
    goToGenerate() {
      this.$router.push('/generate-eth2-keystore');
    },
    async startProvision() {
      await this.handlerStaked.startProvision();
    },
    startPolling(uuid) {
      this.handlerStaked.startPolling(uuid);
    },
    sendTransaction() {
      this.handlerStaked.sendTransaction();
    },
    setData(data) {
      if (this.details.hasOwnProperty(data.key)) {
        this.details[data.key] = data.value;
      } else {
        this.$set(this.details, data.key, data.value);
      }
      // this.handlerStaked.setData(data);
      console.log('this.details', this.details); // todo remove dev item
    },
    // nextStep() {
    //   console.log('nextStep', this.currentStep.index); // todo remove dev item
    //   if (this.currentStep.index === 2) {
    //     console.log('startProvision'); // todo remove dev item
    //     this.startProvision();
    //     // this.$emit('stakeEth2');
    //   }
    //   if (this.currentStep.index === 3) {
    //     console.log('sendTransaction'); // todo remove dev item
    //     // this.$emit('sendTransaction');``
    //     this.sendTransaction();
    //     return;
    //   }
    //   if (!this.$listeners || !this.$listeners['before-next-step']) {
    //     this.nextStepAction();
    //   }
    //   this.canContinue = false;
    // },
    backStep() {
      const currentIndex = this.currentStep.index - 1;
      if (currentIndex >= 0) {
        this.activateStep(currentIndex, true);
      }
    },
    proceed(canContinue, param, ethPrice) {
      console.log('proceed', canContinue, param, ethPrice); // todo remove dev item
      this.canContinue = canContinue;
      this.handlerStaked.setData(param);
      if (ethPrice) {
        this.handlerStaked.setData({ key: 'ethPrice', value: ethPrice });
      }
    }
  }
};
</script>

<style scoped>
.mew-label {
  font-size: 12px;
}

.active-btn {
  background-color: #003583 !important;
}
</style>
