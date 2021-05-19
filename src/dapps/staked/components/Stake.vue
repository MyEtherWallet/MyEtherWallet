<template>
  <div>
    <mew-stepper :items="stepperItems" :on-step="currentStepIdx">
      <template v-if="isStepActive(0)" #stepperContent1>
        <step-one :go-next="nextStepAction" @completed="proceed" />
      </template>
      <template v-if="isStepActive(1)" #stepperContent2>
        <step-two @completed="proceed" />
      </template>
      <template v-if="isStepActive(2)" #stepperContent3>
        <step-three :details="details" @completed="proceed" />
      </template>
      <template v-if="isStepActive(3)" #stepperContent4>
        <step-four :details="details" @completed="proceed" />
      </template>
      <template v-if="isStepActive(4)" #stepperContent5>
        <step-five
          :amt="details.amount ? details.amount : 0"
          :hash="txHash"
          @completed="proceed"
        />
      </template>
    </mew-stepper>
  </div>
</template>

<script>
import stepOne from './steps/SetAmount/SetAmount';
import stepTwo from './steps/Upload/Upload';
import stepThree from './steps/Review/Review';
import stepFour from './steps/InProgress/InProgress';
import stepFive from './steps/Done/Done';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';

const types = ['32', '64', '96', '128'];

export default {
  components: {
    stepOne,
    stepTwo,
    stepThree,
    stepFour,
    stepFive
  },
  props: {
    steps: {
      type: Array,
      default: () => []
    },
    txHash: {
      type: String,
      default: ''
    },
    resetStepper: {
      type: Boolean,
      default: false
    },
    setData: {
      type: Function,
      default: () => {}
    },
    details: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // currentStepIdx: 0,
      currentStep: { index: '0' },
      previousStep: {},
      nextButton: {},
      canContinue: false,
      finalStep: false,
      stepperItems: [
        {
          step: 1,
          name: 'Stake Amount'
        },
        {
          step: 2,
          name: 'Upload your Keystore File'
        },
        {
          step: 3,
          name: 'Review & Enable'
        },
        {
          step: 4,
          name: 'Stake on Eth2'
        },
        {
          step: 5,
          name: 'Done'
        }
      ]
    };
  },
  computed: {
    enterAnimation() {
      if (this.currentStep.index < this.previousStep.index) {
        return 'animated quick fadeInLeft';
      }
      return 'animated quick fadeInRight';
    },
    leaveAnimation() {
      if (this.currentStep.index > this.previousStep.index) {
        return 'animated quick fadeOutLeft';
      }
      return 'animated quick fadeOutRight';
    },
    currentStepIdx() {
      return this.currentStep.index;
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
      if (val && val !== '') {
        this.nextStepAction();
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    async getEthPrice() {
      const price = await fetch(
        'https://cryptorates.mewapi.io/ticker?filter=ETH'
      )
        .then(res => {
          return res.json();
        })
        .catch(e => {
          Toast(e, ERROR);
        });

      this.ethPrice = price && price.data ? price.data.ETH.quotes.USD.price : 0;
    },
    isActive(idx) {
      if (this.amount === types[idx]) {
        return true;
      }
      return false;
    },
    setAmount(idx) {
      if (Number.isInteger(idx) && idx < 4) {
        this.amount = types[idx];
        console.log(this.amount); // todo remove dev item
      }
      this.$emit(
        'completed',
        /*!this.hasError,*/ false,
        {
          key: 'amount',
          value: this.amount
        },
        this.ethPrice
      );
    },
    reset() {
      this.previousStep = {};
      this.init();
      this.$emit('reset');
    },
    isStepActive(index) {
      if (this.currentStep.index === index) {
        return true;
      }
      return false;
    },
    activateStep(index) {
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
      this.nextButton[this.currentStep.name] = true;
      console.log(this.canContinue); // todo remove dev item
      if (this.canContinue) {
        const currentIndex =
          this.currentStep.index === 4 ? 0 : this.currentStep.index + 1;
        this.activateStep(currentIndex);
      }
      this.canContinue = false;
      this.$forceUpdate();
    },
    nextStep() {
      if (this.currentStep.index === 2) {
        this.$emit('stakeEth2');
      }
      if (this.currentStep.index === 3) {
        this.$emit('sendTransaction');
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
      console.log(canContinue, param, ethPrice); // todo remove dev item
      this.canContinue = canContinue;
      this.setData(param);
      if (ethPrice) {
        this.setData({ key: 'ethPrice', value: ethPrice });
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

<style scoped lang="scss">
//@import 'Stepper.scss';
</style>
