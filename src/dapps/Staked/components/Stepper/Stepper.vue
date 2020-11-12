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
            :class="['step', isStepActive(index)]"
            :style="{ width: `${100 / steps.length}%` }"
          >
            <div class="circle mb-2">
              {{ step.name }}
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
        <step-one />
      </transition>
    </div>
    <div
      :class="['button-container', currentStep.index > 0 ? '' : 'only-next']"
    >
      <button
        v-if="currentStep.index > 0"
        :class="[
          'large-round-button-green-filled mt-3 stepper-button previous',
          !canContinue ? 'deactivated' : ''
        ]"
        @click="backStep()"
      >
        {{ $t('common.back') }}
      </button>
      <button
        :class="[
          'large-round-button-green-filled mt-3 stepper-button next',
          !canContinue ? 'deactivated' : ''
        ]"
        @click="nextStep()"
      >
        {{ finalStep ? $t('dappsStaked.steps.4') : $t('common.next') }}
      </button>
    </div>
  </div>
</template>

<script>
import stepOne from './steps/Amount/Amount';

export default {
  components: {
    stepOne: stepOne
  },
  props: {
    steps: {
      type: Array,
      default: () => {}
    },
    reset: {
      type: Boolean,
      default: false
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
      }      this.init();
      this.previousStep = {};
      this.$nextTick(() => {
        this.$emit('reset', true);
      });
    }
  },
  created() {
    this.init();

  },
  methods: {
    isStepActive(index) {
      if (this.currentStep.index === index) {
        return 'activated';
      }
      return 'deactivated';
    },
    activateStep(index, back = false) {
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
        if (!back) {
          this.$emit('completed-step', this.previousStep);
        }
      }
      this.$emit('active-step', this.currentStep);
    },
    nextStepAction() {
      this.nextButton[this.currentStep.name] = true;
      if (this.canContinue) {
        if (this.finalStep) {
          this.$emit('stepper-finished', this.currentStep);
        }
        const currentIndex = this.currentStep.index + 1;
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
      this.$emit(
        'before-next-step',
        { currentStep: this.currentStep },
        (next = true) => {
          this.canContinue = true;
          if (next) {
            this.nextStepAction();
          }
        }
      );
    },
    backStep() {
      this.$emit('clicking-back');
      const currentIndex = this.currentStep.index - 1;
      if (currentIndex >= 0) {
        this.activateStep(currentIndex, true);
      }
    },
    proceed(payload) {
      this.canContinue = payload.value;
    },
    changeNextBtnValue(payload) {
      this.nextButton[this.currentStep.name] = payload.nextBtnValue;
      this.$forceUpdate();
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
