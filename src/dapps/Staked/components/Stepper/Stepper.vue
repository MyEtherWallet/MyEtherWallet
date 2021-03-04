<template>
  <div class="stepper-box">
    <div class="top">
      <div
        class="divider-line"
        :style="{ width: `${(100 / steps.length) * (steps.length - 1) - 10}%` }"
      ></div>
      <div class="steps-wrapper">
        <template v-for="(step, index) in steps">
          <div
            :key="index"
            :class="[
              'step',
              isStepActive(index)
                ? 'activated'
                : index > currentStep.index
                ? 'deactivated'
                : 'completed'
            ]"
            :style="{ width: `${100 / steps.length}%` }"
          >
            <div class="circle mb-2">
              <span v-if="index >= currentStep.index">{{ step.name }}</span>
              <i v-if="index < currentStep.index" class="fa fa-check" />
            </div>
            <div class="step-title">
              <span>{{ step.title }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="content pt-5">
      <transition
        :enter-active-class="enterAnimation"
        :leave-active-class="leaveAnimation"
        mode="out-in"
      >
        <step-one v-if="isStepActive(0)" @completed="proceed" />
        <step-two v-if="isStepActive(1)" @completed="proceed" />
        <step-three
          v-if="isStepActive(2)"
          :details="details"
          @completed="proceed"
        />
        <step-four
          v-if="isStepActive(3)"
          :details="details"
          @completed="proceed"
        />
        <step-five
          v-if="isStepActive(4)"
          :amt="details.amount ? details.amount : 0"
          :hash="txHash"
          @completed="proceed"
        />
      </transition>
    </div>
    <div class="button-container">
      <button
        v-if="currentStep.index > 0 && currentStep.index < 3"
        :class="'mt-3 stepper-button previous'"
        @click="backStep()"
      >
        {{ $t('common.back') }}
      </button>
      <button
        :class="[
          'large-round-button-green-filled mt-3 stepper-button next',
          !canContinue ? 'deactivated' : '',
          currentStep.index === 0 ? 'only-next' : ''
        ]"
        @click="nextStep()"
      >
        {{
          finalStep && currentStep.index !== 4
            ? $t('dappsStaked.steps.4')
            : currentStep.index === 2
            ? $t('dappsStaked.enable-staking')
            : currentStep.index === 3
            ? $t('dappsStaked.stake-on-eth2')
            : currentStep.index === 4
            ? $t('dappsStaked.stake-again')
            : $t('common.next')
        }}
      </button>
    </div>
    <div v-if="isStepActive(1)" class="what-is-eth2">
      <i18n path="dappsStaked.what-is-eth2">
        <a
          slot="learn-more"
          href="https://kb.myetherwallet.com/en/diving-deeper/eth2-address/"
          target="_blank"
        >
          {{ $t('common.learn-more') }}
        </a>
      </i18n>
    </div>
  </div>
</template>

<script>
import stepOne from './steps/SetAmount/SetAmount';
import stepTwo from './steps/Upload/Upload';
import stepThree from './steps/Review/Review';
import stepFour from './steps/InProgress/InProgress';
import stepFive from './steps/Done/Done';

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
      currentStep: {},
      previousStep: {},
      nextButton: {},
      canContinue: false,
      finalStep: false
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
@import 'Stepper.scss';
</style>
