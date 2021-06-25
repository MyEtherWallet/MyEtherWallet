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
        <step-two-upload :next="nextStep" @completed="proceed" />
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
import StepTwoUpload from './staked-steps/StepTwoUpload';
import StepThreeReview from './staked-steps/StepThreeReview';
import StepFourInProgress from './staked-steps/StepFourInProgress';
import StepFiveDone from './staked-steps/StepFiveDone';

export default {
  components: {
    StepOneAmount,
    StepTwoUpload,
    StepThreeReview,
    StepFourInProgress,
    StepFiveDone
  },
  props: {
    currentApr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      amount: '',
      onStep: 3,
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
  methods: {
    /**
     * Sets the value and next step
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
