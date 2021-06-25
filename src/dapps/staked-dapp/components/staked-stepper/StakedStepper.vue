<template>
  <div>
    <!--
    ===================================================
    Staked MEW Stepper
    ===================================================
    -->
    <mew-stepper :items="stepperItems" :on-step="onStep" @onContinue="nextStep">
      <!--
    ===================================================
    Step 1: Select Amount 
    ===================================================
    -->
      <template v-if="onStep === 1" #stepperContent1>
        <step-one-amount :current-apr="currentApr" @onContinue="nextStep" />
      </template>
      <!--
    ===================================================
    Step 2: Generate ETH2 Address
    ===================================================
    -->
      <template v-if="onStep === 2" #stepperContent2>
        <step-two-generate :next="nextStep" @onContinue="nextStep" />
      </template>
      <template v-if="onStep === 3" #stepperContent3>
        <step-three-review
          :details="details"
          :next="nextStep"
          @completed="proceed"
        />
      </template>
      <template v-if="onStep === 4" #stepperContent4>
        <step-four-in-progress :details="details" @completed="proceed" />
      </template>
      <template v-if="onStep === 5" #stepperContent5>
        <step-five-done
          :amt="details.amount ? details.amount : 0"
          :hash="txHash"
          @completed="proceed"
        />
      </template>
    </mew-stepper>
  </div>
</template>

<script>
import StepOneAmount from './staked-steps/StepOneAmount';
import StepTwoGenerate from './staked-steps/StepTwoGenerate';
import StepThreeReview from './staked-steps/StepThreeReview';
import StepFourInProgress from './staked-steps/StepFourInProgress';

export default {
  components: {
    StepOneAmount,
    StepTwoGenerate,
    StepThreeReview,
    StepFourInProgress
  },
  props: {
    currentApr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      amount: 0,
      onStep: 1,
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
        }
      ]
    };
  },
  methods: {
    /**
     * Sets the value and continues to next step
     */
    nextStep(obj) {
      if (obj.onStep === 1) {
        this.amount = obj.value;
      }
      this.onStep += 1;
    }
  }
};
</script>

<style scoped lang="scss"></style>
