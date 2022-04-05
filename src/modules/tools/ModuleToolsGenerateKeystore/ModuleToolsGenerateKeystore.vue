<template>
  <div class="pa-3">
    <!--
    ===================================================
    Staked MEW Stepper
    ===================================================
    -->
    <mew-stepper :items="stepperItems" :on-step="onStep" @onContinue="nextStep">
      <!--
      ===================================================
      Step 1: Generate ETH2 Address
      ===================================================
      -->
      <template v-if="onStep === 1" #stepperContent1>
        <step-one :skipped="skipped" @onContinue="nextStep" @back="back" />
      </template>
      <!--
      ===================================================
      Step 2: Verify Keystore file
      ===================================================
      -->
      <template v-if="onStep === 2" #stepperContent2>
        <step-two
          :skipped="skipped"
          :address="address"
          @onContinue="nextStep"
          @back="back"
        />
      </template>
    </mew-stepper>
  </div>
</template>

<script>
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';
import { ROUTES_HOME } from '@/core/configs/configRoutes';

export default {
  components: {
    StepOne,
    StepTwo
  },
  data() {
    return {
      amount: 0,
      onStep: 1,
      stepperItems: [
        {
          step: 1,
          name: 'Generate Eth2 address'
        },
        {
          step: 2,
          name: 'Verify keystore file'
        }
      ],
      skipped: false,
      address: ''
    };
  },
  mounted() {
    if (this.$route.name == ROUTES_HOME.TOOLS_KEYSTORE.NAME) {
      this.$router.push({ name: ROUTES_HOME.TOOLS_KEYSTORE_1.NAME });
    }
  },
  methods: {
    /**
     * Sets the correct values and continues to next step
     */
    nextStep(obj) {
      switch (obj.onStep) {
        case 1:
          this.address = obj.address;
          this.skipped = obj.isSkipped;
          break;
        case 2:
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
    },
    /* 
    modified reset to set data variables back to their 
    initial state so user is taken back to step 1 when address is changed
    */
    // eslint-disable-next-line
    reset() {
      this.onStep = 1;
      this.amount = 0;
      this.skipped = false;
    }
  }
};
</script>
