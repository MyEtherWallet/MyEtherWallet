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
        <step-three v-if="isStepActive(2)" @completed="proceed" />
        <step-four v-if="isStepActive(3)" @completed="proceed" />
      </transition>
    </div>
    <div class="button-container">
      <button
        v-if="currentStep.index > 0"
        :class="'mt-3 stepper-button previous'"
        @click="backStep()"
      >
        {{
          currentStep.index === 3
            ? $t('dappsStaked.track-ethvm')
            : $t('common.back')
        }}
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
          finalStep
            ? $t('dappsStaked.steps.4')
            : currentStep.index === 2
            ? $t('dappsStaked.sign')
            : $t('common.next')
        }}
      </button>
    </div>
  </div>
</template>

<script>
import stepOne from './steps/SetAmount/SetAmount';
import stepTwo from './steps/Upload/Upload';
import stepThree from './steps/Review/Review';
import stepFour from './steps/Done/Done';

export default {
  components: {
    stepOne,
    stepTwo,
    stepThree,
    stepFour
  },
  props: {
    steps: {
      type: Array,
      default: () => []
    },
    reset: {
      type: Boolean,
      default: false
    },
    setData: {
      type: Function,
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
    reset(val) {
      if (!val) {
        return;
      }
      this.init();
      this.previousStep = {};
      // this.$nextTick(() => {
      //   this.$emit('reset', true);
      // });
    }
  },
  created() {
    this.init();
  },
  methods: {
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
        // if (!back) {
        //   this.$emit('completed-step', this.previousStep);
        // }
      }
      this.$emit('active-step', this.currentStep);
    },
    nextStepAction() {
      this.nextButton[this.currentStep.name] = true;
      if (this.canContinue) {
        // if (this.finalStep) {
        //   this.$emit('stepper-finished', this.currentStep);
        // }
        const currentIndex =
          this.currentStep.index === 3 ? 0 : this.currentStep.index + 1;
        this.activateStep(currentIndex);
      }
      this.canContinue = false;
      this.$forceUpdate();
    },
    nextStep() {
      if (!this.$listeners || !this.$listeners['before-next-step']) {
        this.nextStepAction();
      }
      this.canContinue = false;
      // this.$emit(
      //   'before-next-step',
      //   { currentStep: this.currentStep },
      //   (next = true) => {
      //     this.canContinue = true;
      //     if (next) {
      //       this.nextStepAction();
      //     }
      //   }
      // );
    },
    backStep() {
      const currentIndex = this.currentStep.index - 1;
      if (this.currentStep.index === 3) {
        window.open('https://www.ethvm.com/', '_blank');
        return;
      }
      // this.$emit('clicking-back');
      if (currentIndex >= 0) {
        this.activateStep(currentIndex, true);
      }
    },
    proceed(param) {
      this.canContinue = true;
      this.setData(param);
    },
    init() {
      // Initiate stepper
      this.activateStep(0);
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
