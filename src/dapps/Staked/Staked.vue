<template>
  <div class="staked-wrapper">
    <div class="header-container d-flex">
      <back-button class="button-container" :title="$t('common.exit-dapp')">
        <template v-slot:right>
          <div class="d-flex">
            <div class="d-flex stats-container">
              <span class="staking-percent">12.38%</span>
              <span>{{ $t('dappsStaked.current-stake-title') }}</span>
            </div>
            <div class="d-flex stats-container px-2">
              <span class="total-eth-percent">2.38%</span>
              <span>{{ $t('dappsStaked.total-eth-title') }}</span>
            </div>
          </div>
        </template>
      </back-button>
    </div>
    <div class="about-container">
      <img :src="staked" height="20px" alt="Staked Logo" />
      <p class="pt-2">{{ $t('dappsStaked.about') }}</p>
    </div>
    <stepper
      :steps="steps"
      @completed-step="completeStep"
      @active-step="isStepActive"
      @stepper-finished="alert"
    />
    <div class="footer d-flex pb-5">
      <i18n path="dappsStaked.what-is-eth2">
        <!-- need to add link -->
        <span slot="learn-more" class="learn">{{
          $t('common.learn-more')
        }}</span>
      </i18n>
      <i18n path="dappsStaked.do-not-have-eth2">
        <!-- need to add link -->
        <span slot="generate" class="generate">{{
          $t('dappsStaked.generate')
        }}</span>
      </i18n>
    </div>
  </div>
</template>

<script>
import backButton from '@/layouts/InterfaceLayout/components/BackButton';
import staked from '@/assets/images/icons/dapps/staked.png';
import stepper from './components/Stepper/Stepper';
// import stepOne from './components/AmountStep/AmountStep.vue';
// import StepTwo from './StepTwo.vue';

export default {
  components: {
    backButton,
    stepper
    // stepOne
  },
  data() {
    return {
      staked: staked,
      steps: [
        {
          name: 1,
          title: this.$t('dappsStaked.steps.1'),
          completed: false
        },
        {
          name: 2,
          title: this.$t('dappsStaked.steps.2'),
          // component: StepTwo,
          completed: false
        },
        {
          name: 3,
          title: this.$t('dappsStaked.steps.3'),
          // component: StepTwo,
          completed: false
        },
        {
          name: 4,
          title: this.$t('dappsStaked.steps.4'),
          // component: StepTwo,
          completed: false
        }
      ]
    };
  },
  methods: {
    completeStep(payload) {
      this.steps.forEach(step => {
        if (step.name === payload.name) {
          step.completed = true;
        }
      });
    },
    isStepActive(payload) {
      this.steps.forEach(step => {
        if (step.name === payload.name) {
          if (step.completed === true) {
            step.completed = false;
          }
        }
      });
    },
    // Executed when @stepper-finished event is triggered
    alert(payload) {
      console.log('done', payload);
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Staked.scss';
</style>
