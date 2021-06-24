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
    <template #HeaderBody>
      <v-divider class="textPrimary" />
      <div class="d-flex flex-wrap align-center justify-center">
        <div class="text-uppercase textPrimary--text font-weight-bold">
          Total Staked: <span class="primary--text">4,202,920 ETH</span>
        </div>
        <v-icon color="textPrimary">mdi-circle-medium</v-icon>
        <div class="text-uppercase textPrimary--text font-weight-bold">
          Current APR: <span class="primary--text">7.64%</span>
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

    <template #tabContent1>
      <v-sheet
        min-height="500px"
        max-width="700px"
        color="transparent"
        class="mx-auto"
      >
        <mew-stepper :items="stepperItems" :on-step="getCurrentStep">
          <template v-if="isStepActive(0)" #stepperContent1>
            <step-one :next="nextStep" @completed="proceed" />
          </template>
          <template v-if="isStepActive(1)" #stepperContent2>
            <step-two :back="backStep" :next="nextStep" @completed="proceed" />
          </template>
          <template v-if="isStepActive(2)" #stepperContent3>
            <step-three
              :details="details"
              :back="backStep"
              :next="nextStep"
              @completed="proceed"
            />
          </template>
          <template v-if="isStepActive(0)" #stepperContent4>
            <step-four
              :details="details"
              :next="nextStep"
              @completed="proceed"
            />
          </template>
        </mew-stepper>
      </v-sheet>
    </template>
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
import stepOne from './stepper/steps/SetAmount/SetAmount';
import stepTwo from './stepper/steps/GenerateEth2Address/GenerateEth2Address';
import stepThree from './stepper/steps/Upload/Upload';
import stepFour from './stepper/steps/Review/Review';
import status from './components/status/Status';

export default {
  name: 'TheStakedLayout',
  components: {
    TheWrapperDapp,
    stepOne,
    stepTwo,
    stepThree,
    stepFour,
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
      tabs: [{ name: 'stake' }, { name: 'status' }],
      stepperItems: [
        {
          step: 1,
          name: 'Stake Amount'
        },
        {
          step: 2,
          name: 'Generate Eth2 address'
        },
        {
          step: 3,
          name: 'Upload keystore file'
        },
        {
          step: 4,
          name: 'Review & stake'
        },
        {
          step: 5,
          name: 'Done'
        }
      ],
      steps: [
        {
          name: 1,
          title: '1', //this.$t('dappsStaked.steps.1'),
          completed: false
        },
        {
          name: 2,
          title: '2', //this.$t('dappsStaked.steps.2'),
          completed: false
        },
        {
          name: 3,
          title: '3', //this.$t('dappsStaked.steps.3'),
          completed: false
        },
        {
          name: 4,
          title: '4', //this.$t('dappsStaked.steps.4'),
          completed: false
        },
        {
          name: 5,
          title: '5', //this.$t('dappsStaked.steps.5'),
          completed: false
        }
      ],
      currentStep: { index: '0' },
      previousStep: {},
      nextButton: {},
      canContinue: false,
      finalStep: false,
      presentStep: 0,
      canProceed: false
    };
  },
  computed: {
    ...mapState('wallet', ['balance', 'web3', 'address']),
    ...mapGetters('global', ['network', 'gasPrice']),
    getCurrentStep() {
      return this.currentStep.index + 1;
    },
    totalStakedAndApr() {
      console.error('staked', this.handlerStaked.getTotalStakedAndApr());
      return this.handlerStaked.getTotalStakedAndApr();
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
    currentStep: {
      handler: function (newVal, oldVal) {
        if (newVal.index === 0 && oldVal.index === 4) {
          this.reset();
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
  created() {
    this.init();
  },
  mounted() {
    this.handlerStaked = new handlerStaked();
    this.handlerStaked.on('setData', data => {
      console.log(data); // todo remove dev item
      this.setData(data);
    });
    this.handlerStaked.on('myValidators', validators => {
      this.myValidators = validators;
      this.loadingValidators = false;
    });

    this.handlerStaked.on('transaction', () => {
      console.log('transaction sent'); // todo remove dev item
    });
    this.handlerStaked.on('txHash', txHash => {
      console.log('txHash', txHash); // todo remove dev item
      this.txHash = txHash;
    });
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
      this.totalStaked = '';
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
    isStepActive(index) {
      if (this.currentStep.index === index) {
        return true;
      }
      return false;
    },
    activateStep(index) {
      console.log('activateStep'); // todo remove dev item
      if (this.steps[index]) {
        this.previousStep = this.currentStep;
        this.currentStep = {
          name: this.steps[index].name,
          index: index
        };
        if (index + 1 === this.steps.length) {
          this.finalStep = true;
        } else {
          this.finalStep = false;
        }
      }
      this.$emit('active-step', this.currentStep);
    },
    nextStepAction() {
      console.log('nextStepAction'); // todo remove dev item
      console.log(this.canContinue); // todo remove dev item

      this.nextButton[this.currentStep.name] = true;
      if (this.canContinue) {
        const currentIndex =
          +this.currentStep.index + 1 === 5 ? 0 : this.currentStep.index + 1;
        this.activateStep(currentIndex);
      }
      this.canContinue = false;
      this.$forceUpdate();
    },
    nextStep() {
      console.log('nextStep', this.currentStep.index); // todo remove dev item
      if (this.currentStep.index === 2) {
        console.log('startProvision'); // todo remove dev item
        this.startProvision();
        // this.$emit('stakeEth2');
      }
      if (this.currentStep.index === 3) {
        console.log('sendTransaction'); // todo remove dev item
        // this.$emit('sendTransaction');``
        this.sendTransaction();
        return;
      }
      if (!this.$listeners || !this.$listeners['before-next-step']) {
        this.nextStepAction();
      }
      this.canContinue = false;
    },
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
    },
    init() {
      // Initiate stepper
      this.activateStep(0);
      this.canContinue = false;
      this.steps.forEach(step => {
        this.nextButton[step.name] = false;
      });
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
