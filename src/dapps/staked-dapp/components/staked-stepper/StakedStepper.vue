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
        <step-two-generate
          :skipped="skipped"
          @onContinue="nextStep"
          @back="back"
        />
      </template>
      <!--
    ===================================================
    Step 3: Upload Keystore file
    ===================================================
    -->
      <template v-if="onStep === 3" #stepperContent3>
        <step-three-upload
          :skipped="skipped"
          :address="address"
          @onContinue="nextStep"
          @back="back"
        />
      </template>
      <template v-if="onStep === 4" #stepperContent4>
        <step-four-in-progress />
      </template>
    </mew-stepper>
  </div>
</template>

<script>
import StepOneAmount from './staked-steps/StepOneAmount';
import StepTwoGenerate from './staked-steps/StepTwoGenerate';
// import StepThreeReview from './staked-steps/StepThreeReview';
import StepFourInProgress from './staked-steps/StepFourInProgress';
import StepThreeUpload from './staked-steps/StepThreeUpload';

export default {
  components: {
    StepOneAmount,
    StepTwoGenerate,
    StepFourInProgress,
    StepThreeUpload
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
      ],
      skipped: false
    };
  },
  methods: {
    /**
     * Sets the correct values and continues to next step
     */
    nextStep(obj) {
      switch (obj.onStep) {
        case 1:
          this.amount = obj.amount;
          break;
        case 2:
          this.address = obj.address;
          this.skipped = obj.isSkipped;
          break;
        case 3:
          this.address = obj.address;
          break;
        default:
          break;
      }
      this.onStep += 1;
    },
    /**
     * Goes back a step
     */
    back() {
      this.onStep -= 1;
    }
  }
};
</script>

<style scoped lang="scss"></style>
